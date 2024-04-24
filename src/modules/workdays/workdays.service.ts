import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Workday, WorkdayDocument } from '@/schemas/Workday';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { ProjectsService } from '../projects/projects.service';
import { FilesService } from '../files/files.service';
import { Folder } from '@/types/File';

@Injectable()
export class WorkdaysService {
  constructor(
    @InjectModel(Workday.name)
    private readonly workdayModel: Model<WorkdayDocument>,
    private readonly projectsService: ProjectsService,
    private readonly filesService: FilesService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getWorkdaysByWorkerId(
    isActive: boolean,
    workerId: Types.ObjectId,
    companyId: Types.ObjectId,
  ) {
    const query = {
      workerId,
      companyId,
    };

    if (isActive) query['isActive'] = isActive;

    const workdays = await this.workdayModel.aggregate([
      {
        $match: query,
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
        $unwind: '$project',
      },
      {
        $project: {
          _id: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          isActive: 1,
          type: 1,
          project: {
            _id: 1,
            name: 1,
          },
        },
      },
    ]);

    return {
      data: workdays,
    };
  }

  async create(
    file: Express.Multer.File,
    workday: CreateWorkdayDto,
    workerId: Types.ObjectId,
    companyId: Types.ObjectId,
  ) {
    workday.projectId = new Types.ObjectId(workday.projectId);

    const project = await this.projectsService.findOne({
      _id: workday.projectId,
      companyId,
    });

    if (!project) {
      throw new NotFoundException('El proyecto no existe');
    }

    const activeWorkday = await this.workdayModel.find({
      workerId,
      companyId,
      isActive: true,
    });

    if (activeWorkday.length > 0) {
      throw new ConflictException('El operario ya tiene una jornada en curso');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { originalname, buffer } = file;

      const newFile = await this.filesService.uploadOneFile(
        originalname,
        buffer,
        Folder.WORKER_WORKDAY,
        companyId,
        session,
      );

      const newWorkday = {
        fileId: newFile.id,
        workerId,
        companyId,
        updatedBy: workerId,
        ...workday,
      };

      await this.workdayModel.create([newWorkday], { session });

      await session.commitTransaction();

      return {
        message: 'Jornada iniciada correctamente',
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async endWorkday(workdayId: Types.ObjectId, companyId: Types.ObjectId) {
    const workday = await this.workdayModel.findOne({
      _id: workdayId,
      companyId,
    });

    if (!workday) {
      throw new NotFoundException('La jornada no existe');
    }

    if (workday.endTime || !workday.isActive) {
      throw new ConflictException('La jornada ya ha sido finalizada');
    }

    try {
      await this.workdayModel.updateOne(
        { _id: workdayId },
        { endTime: Number(new Date().getTime()), isActive: false },
      );

      return {
        message: 'Jornada finalizada correctamente',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
