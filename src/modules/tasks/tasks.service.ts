import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { Task, TaskDocument } from '@/schemas/Task';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { FilesService } from '../files/files.service';
import { TaskStatus, TaskType } from '@/types/Task';
import { Folder } from '@/types/File';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @Inject(REQUEST) private readonly request: Record<string, unknown>,
    private readonly projectsService: ProjectsService,
    private readonly filesService: FilesService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getAll(
    companyId: Types.ObjectId,
    projectId: Types.ObjectId,
    status: TaskStatus,
    type: TaskType,
  ) {
    const query = {
      companyId,
      projectId,
    };

    if (status) query['status'] = status;
    if (type) query['type'] = type;

    await this.verifyExistProject(projectId);

    const tasks = await this.taskModel.aggregate([
      {
        $match: query,
      },

      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          type: 1,
        },
      },
    ]);

    return {
      data: tasks,
    };
  }

  async getById(taskId: Types.ObjectId, companyId: Types.ObjectId) {
    const task = await this.taskModel.aggregate([
      {
        $match: {
          _id: taskId,
          companyId,
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'files',
          foreignField: '_id',
          as: 'files',
        },
      },
      {
        $unwind: '$project',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          type: 1,
          supervisor: 1,
          floor: 1,
          cost: 1,
          startDate: 1,
          endDate: 1,
          createdAt: 1,
          files: {
            _id: 1,
            url: 1,
          },
          project: {
            _id: 1,
            name: 1,
          },
        },
      },
    ]);

    if (!task) {
      throw new NotFoundException('La tarea no existe');
    }

    return {
      data: task[0],
    };
  }

  async create(createTaskDto: CreateTaskDto, companyId: Types.ObjectId) {
    createTaskDto.projectId = new Types.ObjectId(createTaskDto.projectId);

    const { projectId, workerId } = createTaskDto;

    await this.verifyExistProject(projectId);

    await this.verifyWorkerIsInProject(projectId, workerId);

    try {
      await this.taskModel.create({
        ...createTaskDto,
        companyId,
        workerId,
        createdBy: workerId,
        updatedBy: workerId,
      });

      return {
        message: 'Tarea creada con éxito.',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async startTask(
    taskId: Types.ObjectId,
    file: Express.Multer.File,
    companyId: Types.ObjectId,
  ) {
    const subId = new Types.ObjectId(this.request.user['sub']);

    const task = await this.verifyTaskExist(taskId, companyId);

    if (task.status !== TaskStatus.TO_DO) {
      throw new BadRequestException('La tarea ya fue iniciada');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { originalname, buffer } = file;

      const newFile = await this.filesService.uploadOneFile(
        originalname,
        buffer,
        Folder.COMPANY_PROJECT_TASK,
        companyId,
        session,
      );

      task.files = [newFile.id];
      task.status = TaskStatus.IN_PROGRESS;
      task.updatedAt = new Date().getTime();
      task.updatedBy = subId;

      await this.taskModel.updateOne({ _id: taskId }, task, { session });

      await session.commitTransaction();

      return {
        message: 'Tarea iniciada.',
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async taskReview(taskId: Types.ObjectId, companyId: Types.ObjectId) {
    const subId = new Types.ObjectId(this.request.user['sub']);

    const task = await this.verifyTaskExist(taskId, companyId);

    if (task.status !== TaskStatus.IN_PROGRESS) {
      throw new BadRequestException('La tarea no se encuentra en progreso');
    }

    task.status = TaskStatus.WAITING_APPROVAL;
    task.updatedAt = new Date().getTime();
    task.updatedBy = subId;

    await task.save();

    return {
      message: 'Tarea enviada para revisión.',
    };
  }

  async manageTaskFiles(
    taskId: Types.ObjectId,
    companyId: Types.ObjectId,
    files?: Express.Multer.File[],
    filesToDelete?: Types.ObjectId[],
  ) {
    const subId = new Types.ObjectId(this.request.user['sub']);
    const task = await this.verifyTaskExist(taskId, companyId);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      if (filesToDelete) {
        await this.removeFilesFromTask(
          task,
          filesToDelete,
          subId,
          companyId,
          session,
        );
      }

      if (files) {
        await this.uploadFilesToTask(task, subId, companyId, files, session);
      }

      await session.commitTransaction();

      return {
        message: 'Imagenes actualizadas con éxito.',
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async uploadFilesToTask(
    task: TaskDocument,
    updateBy: Types.ObjectId,
    companyId: Types.ObjectId,
    files: Express.Multer.File[],
    session: ClientSession | null = null,
  ) {
    const newFiles = await this.filesService.uploadManyFiles(
      files,
      Folder.COMPANY_PROJECT_TASK,
      companyId,
      session,
    );

    task.files = [...task.files, ...newFiles.map((file) => file.id)];
    task.updatedAt = new Date().getTime();
    task.updatedBy = updateBy;

    await this.taskModel.updateOne({ _id: task._id }, task, { session });
  }

  private async removeFilesFromTask(
    task: TaskDocument,
    filesToDelete: Types.ObjectId[],
    updateBy: Types.ObjectId,
    companyId: Types.ObjectId,
    session: ClientSession | null = null,
  ) {
    await this.filesService.deleteManyFiles(filesToDelete, companyId, session);

    task.files = task.files.filter((fileId) => !filesToDelete.includes(fileId));
    task.updatedAt = new Date().getTime();
    task.updatedBy = updateBy;

    await this.taskModel.updateOne({ _id: task._id }, task, { session });
  }

  private async verifyTaskExist(
    taskId: Types.ObjectId,
    companyId: Types.ObjectId,
  ) {
    const task = await this.taskModel.findOne({
      _id: taskId,
      companyId,
    });

    if (!task) {
      throw new NotFoundException('La tarea no existe');
    }

    return task;
  }

  private async verifyExistProject(projectId: Types.ObjectId) {
    const existProject = await this.projectsService.findById(projectId);

    if (!existProject) {
      throw new NotFoundException('El proyecto no existe');
    }
  }

  private async verifyWorkerIsInProject(
    projectId: Types.ObjectId,
    workerId: Types.ObjectId,
  ) {
    const project = await this.projectsService.findById(projectId);

    const workerIsInProject = project.workers.some((id) => workerId.equals(id));

    if (!workerIsInProject) {
      throw new BadRequestException('El Operario no pertenece al proyecto');
    }
  }
}
