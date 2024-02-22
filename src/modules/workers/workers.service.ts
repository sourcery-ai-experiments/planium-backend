import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from '@schema/Worker';
import { UsersService } from '@module/users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { CompaniesService } from '../companies/companies.service';
import { CreateWorkerDto } from '@module/workers/dto/create-worker.dto';
import { UserType } from '@/types/User';
import { generateUsername } from '@/helpers/generate-data';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name)
    private readonly workerModel: Model<WorkerDocument>,
    private readonly companiesService: CompaniesService,
    private readonly userService: UsersService,
    private readonly projectsService: ProjectsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(worker: CreateWorkerDto, companyId: Types.ObjectId) {
    const session = await this.connection.startSession();
    session.startTransaction();

    const company = await this.companiesService.findById(companyId);

    if (!company) {
      throw new UnauthorizedException('La empresa no existe');
    }

    const username = generateUsername(worker.username, company.publicId);

    const userBody = {
      name: worker.name,
      username,
      email: worker.email,
      password: this.generateTemporalPassword(),
      type: UserType.WORKER,
      companyId,
    };

    const workerBody = {
      companyId,
    };

    try {
      const user = await this.userService.create(userBody, session);

      const newWorker = await this.workerModel.create(
        [
          {
            ...workerBody,
            userId: user.data._id,
          },
        ],
        { session },
      );

      worker.projectId = new Types.ObjectId(worker.projectId);

      await this.projectsService.addWorkers(
        worker.projectId,
        [newWorker[0]._id.toString()],
        companyId,
        session,
      );

      await session.commitTransaction();

      return {
        message: 'Operario creado correctamente',
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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

  private generateTemporalPassword() {
    return Math.random().toString(36).slice(-8);
  }
}
