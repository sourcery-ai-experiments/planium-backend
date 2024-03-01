import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from '@schema/Worker';
import { CompanyDocument } from '@/schemas/Company';
import { UsersService } from '@module/users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { CompaniesService } from '../companies/companies.service';
import { SesService } from '../aws/aws.ses.service';
import { FilesService } from '../files/files.service';
import { CreateWorkerDto } from '@module/workers/dto/create-worker.dto';
import { UserType } from '@/types/User';
import { generateUsername } from '@/helpers/generate-data';
import { welcomeTemplate } from '@/templates/email/welcome';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Folder } from '@/types/File';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name)
    private readonly workerModel: Model<WorkerDocument>,
    private readonly sesService: SesService,
    private readonly filesService: FilesService,
    private readonly companiesService: CompaniesService,
    private readonly userService: UsersService,
    private readonly projectsService: ProjectsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

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

  async create(worker: CreateWorkerDto, companyId: Types.ObjectId) {
    const company = await this.validateCompanyExists(companyId);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const temporalPassword = this.generateTemporalPassword();

      const user = await this.createUser(
        worker,
        company,
        session,
        temporalPassword,
      );

      const newWorker = await this.createWorker(
        user.data._id,
        companyId,
        session,
      );

      await this.assingWorkerToProject(
        worker.projectId,
        newWorker._id,
        companyId,
        session,
      );

      await this.sendWelcomeEmail(
        worker.email,
        user.data.username,
        temporalPassword,
        user.data.name,
      );

      await session.commitTransaction();

      return { message: 'Operario creado correctamente' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async update(
    workerId: Types.ObjectId,
    updateWorkerDto: UpdateWorkerDto,
    companyId: Types.ObjectId,
    file?: Express.Multer.File,
  ) {
    const worker = await this.workerModel.findOne({ _id: workerId, companyId });

    if (!worker) {
      throw new UnauthorizedException('El operario no existe');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await this.updateUser(updateWorkerDto, worker.userId, session, companyId);

      const fileId = await this.uploadW9File(file, worker, companyId, session);

      if (fileId) {
        updateWorkerDto.personalInformation = {
          ...updateWorkerDto.personalInformation,
          fileId,
        };
      }

      await this.workerModel.updateOne({ _id: workerId }, updateWorkerDto, {
        session,
      });

      await session.commitTransaction();

      return { message: 'Operario actualizado correctamente' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async changePassword(userId: Types.ObjectId, password: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    try {
      await this.userService.changePassword(userId, password);

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new Error(error);
    }
  }

  private async validateCompanyExists(companyId: Types.ObjectId) {
    const company = await this.companiesService.findById(companyId);

    if (!company) {
      throw new UnauthorizedException('La empresa no existe');
    }

    return company;
  }

  private async createUser(
    worker: CreateWorkerDto,
    company: CompanyDocument,
    session: ClientSession,
    temporalPassword: string,
  ) {
    const username = generateUsername(worker.username, company.publicId);

    const userBody = {
      name: worker.name,
      username,
      email: worker.email,
      password: temporalPassword,
      type: UserType.WORKER,
      companyId: company._id,
    };

    return await this.userService.create(userBody, session);
  }

  private async updateUser(
    worker: UpdateWorkerDto,
    userId: Types.ObjectId,
    session: ClientSession,
    companyId: Types.ObjectId,
  ) {
    const userBody = {
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
    };

    return await this.userService.update(userId, userBody, companyId, session);
  }

  private async createWorker(
    userId: Types.ObjectId,
    companyId: Types.ObjectId,
    session: ClientSession,
  ) {
    const newWorker = await this.workerModel.create(
      [
        {
          companyId,
          userId,
        },
      ],
      { session },
    );

    return newWorker[0];
  }

  private async assingWorkerToProject(
    projectId: Types.ObjectId,
    workerId: Types.ObjectId,
    companyId: Types.ObjectId,
    session: ClientSession,
  ) {
    projectId = new Types.ObjectId(projectId);
    await this.projectsService.addWorkers(
      projectId,
      [workerId.toString()],
      companyId,
      session,
    );
  }

  private async sendWelcomeEmail(
    email: string,
    username: string,
    password: string,
    name: string,
  ) {
    await this.sesService.sendEmail(
      email,
      'Bienvenido a la plataforma',
      welcomeTemplate(name, username, password),
    );
  }

  private async uploadW9File(
    file: Express.Multer.File,
    worker: WorkerDocument,
    companyId: Types.ObjectId,
    session: ClientSession,
  ): Promise<Types.ObjectId> | undefined {
    if (file) {
      const fileId = worker?.personalInformation?.fileId;
      if (fileId) {
        await this.filesService.deleteOneFile(fileId, companyId, session);
      }
      const newFile = await this.filesService.uploadOneFile(
        file.originalname,
        file.buffer,
        Folder.WORKER_W9,
        companyId,
        session,
      );

      return newFile.id;
    }
  }

  private generateTemporalPassword() {
    return Math.random().toString(36).slice(-8);
  }
}
