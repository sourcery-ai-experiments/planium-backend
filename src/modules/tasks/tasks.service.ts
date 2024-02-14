import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '@/schemas/Task';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { TaskStatus } from '@/types/Task';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @Inject(REQUEST) private readonly request: Record<string, unknown>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, companyId: Types.ObjectId) {
    const userId = new Types.ObjectId(this.request.user['userId']);
    createTaskDto.projectId = new Types.ObjectId(createTaskDto.projectId);

    const existProject = await this.projectsService.findById(
      createTaskDto.projectId,
    );

    if (!existProject) {
      throw new NotFoundException('El id del proyecto no existe');
    }

    if (createTaskDto?.workerId) {
      createTaskDto.workerId = new Types.ObjectId(createTaskDto.workerId);
    }

    try {
      await this.taskModel.create({
        ...createTaskDto,
        companyId,
        workerId: createTaskDto?.workerId ? createTaskDto.workerId : userId,
        createdBy: userId,
        updatedBy: userId,
      });

      return {
        message: 'Tarea creada con éxito.',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(companyId: Types.ObjectId) {
    const tasks = await this.taskModel.aggregate([
      {
        $match: {
          companyId,
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
        },
      },
    ]);

    return tasks;
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
          from: 'files',
          localField: 'files',
          foreignField: '_id',
          as: 'files',
        },
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
          files: {
            _id: 1,
            url: 1,
          },
        },
      },
    ]);

    if (!task) {
      throw new NotFoundException('La tarea no existe');
    }

    return task;
  }

  async taskReview(
    files: string[],
    taskId: Types.ObjectId,
    companyId: Types.ObjectId,
  ) {
    const userId = new Types.ObjectId(this.request.user['userId']);

    const task = await this.taskModel.findOne({
      _id: taskId,
      companyId,
    });

    if (!task) {
      throw new NotFoundException('La tarea no existe');
    }

    if (task.status === TaskStatus.WAITING_APPROVAL) {
      throw new BadRequestException('La tarea ya fue enviada para revisión');
    }

    if (task.status === TaskStatus.DONE) {
      throw new BadRequestException('La tarea ya fue completada');
    }
    const filesObjectIds = files.map((file) => new Types.ObjectId(file));
    task.files = filesObjectIds;
    task.status = TaskStatus.WAITING_APPROVAL;
    task.updatedAt = new Date().getTime();
    task.updatedBy = userId;

    await task.save();

    return {
      message: 'Tarea enviada para revisión.',
    };
  }
}
