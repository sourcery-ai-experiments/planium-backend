/// <reference types="multer" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Connection, Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from '@schema/Worker';
import { UsersService } from '@module/users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { CompaniesService } from '../companies/companies.service';
import { SesService } from '../aws/aws.ses.service';
import { FilesService } from '../files/files.service';
import { CreateWorkerDto } from '@module/workers/dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
export declare class WorkersService {
    private readonly workerModel;
    private readonly sesService;
    private readonly filesService;
    private readonly companiesService;
    private readonly userService;
    private readonly projectsService;
    private readonly connection;
    constructor(workerModel: Model<WorkerDocument>, sesService: SesService, filesService: FilesService, companiesService: CompaniesService, userService: UsersService, projectsService: ProjectsService, connection: Connection);
    findAll(): Promise<Worker[]>;
    findById(id: string): Promise<Worker>;
    findOne(where: Record<string, any>): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Worker> & Worker & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    create(worker: CreateWorkerDto, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    update(workerId: Types.ObjectId, updateWorkerDto: UpdateWorkerDto, companyId: Types.ObjectId, file?: Express.Multer.File): Promise<{
        message: string;
    }>;
    uploadAvatar(file: Express.Multer.File, workerId: Types.ObjectId, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    changePassword(userId: Types.ObjectId, password: string): Promise<{
        message: string;
    }>;
    private validateCompanyExists;
    private createUser;
    private updateUser;
    private createWorker;
    private assingWorkerToProject;
    private sendWelcomeEmail;
    private uploadW9File;
    private generateTemporalPassword;
}
