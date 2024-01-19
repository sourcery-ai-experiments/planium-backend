import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Worker, WorkerDocument } from '@schema/Worker';
import { CreateWorkerDto } from '@module/workers/dto/create-worker.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name)
    private readonly workerModel: Model<WorkerDocument>,
  ) {}

  async create(worker: CreateWorkerDto) {
    const existEmail = await this.verifyEmailExists(worker.email);

    if (existEmail) {
      throw new BadRequestException('El correo electrónico ya existe');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(worker.password, salt);

    worker.password = hashedPassword;

    const newWorker = await this.workerModel.create(worker);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...workerData } = newWorker.toObject();

    return {
      message: 'Operario creado correctamente',
      data: workerData,
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

  async verifyEmailExists(email: string) {
    try {
      return await this.findOne({ email });
    } catch (error) {
      throw new Error(error);
    }
  }
}
