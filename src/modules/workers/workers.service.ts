import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Worker, WorkerDocument } from '@/schemas/Worker';
import { CreateWorkerDto } from '@/modules/workers/dto/create-worker.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name)
    private readonly workerModel: Model<WorkerDocument>,
  ) {}

  async create(worker: CreateWorkerDto) {
    await this.verifyEmailExists(worker.email);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(worker.password, salt);

    worker.password = hashedPassword;

    const newWorker = new this.workerModel(worker);
    await newWorker.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...workerData } = newWorker.toObject();

    return {
      message: 'Operario creado correctamente',
      data: workerData,
    };
  }

  async findAll(): Promise<Worker[]> {
    return this.workerModel.find().exec();
  }

  async findById(id: string): Promise<Worker> {
    return this.workerModel.findById(id).exec();
  }

  async findOne(where: Record<string, string>) {
    return this.workerModel.findOne(where).exec();
  }

  private async verifyEmailExists(email: string) {
    const worker = await this.findOne({ email });
    if (worker) {
      throw new BadRequestException('El correo electrónico ya existe');
    }
  }
}
