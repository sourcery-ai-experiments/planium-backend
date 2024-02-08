import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from '@schema/Worker';
import { UsersService } from '@module/users/users.service';
import { CreateWorkerDto } from '@module/workers/dto/create-worker.dto';
import { UserType } from '@/types/User';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name)
    private readonly workerModel: Model<WorkerDocument>,
    private readonly userService: UsersService,
  ) {}

  async create(worker: CreateWorkerDto) {
    const userBody = {
      name: worker.name,
      email: worker.email,
      password: worker.password,
      phone: worker.phone,
      nationality: worker.nationality,
      type: UserType.WORKER,
    };

    if (worker?.personalInformation?.fileId) {
      worker.personalInformation.fileId = new Types.ObjectId(
        worker.personalInformation.fileId,
      );
    }

    const workerBody = {
      personalInformation: worker?.personalInformation,
      emergencyContact: worker?.emergencyContact,
    };

    const user = await this.userService.create(userBody);

    try {
      await this.workerModel.create({
        ...workerBody,
        userId: user.data._id,
      });

      return {
        message: 'Operario creado correctamente',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async changePassword(userId: string, password: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    try {
      await this.userService.changePassword(userId, password);

      return {
        message: 'Contraseña actualizada correctamente',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Worker[]> {
    try {
      return this.workerModel.find().exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findById(id: string): Promise<Worker> {
    try {
      return this.workerModel.findById(id).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(where: Record<string, any>) {
    try {
      return this.workerModel.findOne(where).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
}
