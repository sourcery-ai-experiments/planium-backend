import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    const workerBody = {
      personalInformation: worker?.personalInformation,
      emergencyContact: worker?.emergencyContact,
      fileId: worker?.fileId,
    };

    const user = await this.userService.create(userBody);

    await this.workerModel.create({
      ...workerBody,
      userId: user.data._id,
    });

    return {
      message: 'Operario creado correctamente',
    };
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

  async findOne(where: Record<string, string>) {
    try {
      return this.workerModel.findOne(where).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
}
