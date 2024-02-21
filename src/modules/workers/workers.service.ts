import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from '@schema/Worker';
import { UsersService } from '@module/users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateWorkerDto } from '@module/workers/dto/create-worker.dto';
import { UserType } from '@/types/User';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name)
    private readonly workerModel: Model<WorkerDocument>,
    private readonly userService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(worker: CreateWorkerDto, companyId: Types.ObjectId) {
    const userBody = {
      name: worker.name,
      email: worker.email,
      password: worker.password,
      phone: worker.phone,
      countryId: new Types.ObjectId(worker.countryId),
      type: UserType.WORKER,
      companyId,
    };

    if (worker?.personalInformation?.fileId) {
      worker.personalInformation.fileId = new Types.ObjectId(
        worker.personalInformation.fileId,
      );
    }

    const workerBody = {
      personalInformation: worker?.personalInformation,
      emergencyContact: worker?.emergencyContact,
      companyId,
    };

    const user = await this.userService.create(userBody);

    const newWorker = await this.workerModel.create({
      ...workerBody,
      userId: user.data._id,
    });

    worker.projectId = new Types.ObjectId(worker.projectId);

    await this.projectsService.addWorkers(
      worker.projectId,
      [newWorker._id.toString()],
      companyId,
    );

    return {
      message: 'Operario creado correctamente',
    };
  }

  async changePassword(userId: Types.ObjectId, password: string) {
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
