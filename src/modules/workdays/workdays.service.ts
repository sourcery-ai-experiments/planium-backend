import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workday, WorkdayDocument } from '@/schemas/Workday';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { WorkersService } from '@module/workers/workers.service';

@Injectable()
export class WorkdaysService {
  constructor(
    @InjectModel(Workday.name)
    private readonly workdayModel: Model<WorkdayDocument>,
    private readonly workersService: WorkersService,
  ) {}

  async create(
    workday: CreateWorkdayDto,
    workerId: Types.ObjectId,
    companyId: Types.ObjectId,
  ) {
    workday.fileId = new Types.ObjectId(workday.fileId);
    workday.projectId = new Types.ObjectId(workday.projectId);

    const activeWorkday = await this.workdayModel.find({
      workerId,
      companyId,
      isActive: true,
    });

    if (activeWorkday.length > 0) {
      throw new ConflictException('El operario ya tiene una jornada en curso');
    }

    const worker = await this.workersService.findOne(workerId);

    if (!worker) {
      throw new NotFoundException('El operario no existe');
    }

    const newWorkday = {
      workerId,
      companyId,
      updatedBy: workerId,
      ...workday,
    };

    try {
      await this.workdayModel.create(newWorkday);

      return {
        message: 'Jornada creada correctamente',
      };
    } catch (error) {
      throw new Error(error);
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
