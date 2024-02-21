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
import { CreateWorkerDto } from '@module/workers/dto/create-worker.dto';
export declare class WorkersService {
    private readonly workerModel;
    private readonly userService;
    private readonly projectsService;
    private readonly connection;
    constructor(workerModel: Model<WorkerDocument>, userService: UsersService, projectsService: ProjectsService, connection: Connection);
    create(worker: CreateWorkerDto, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    findAll(): Promise<Worker[]>;
    findById(id: string): Promise<Worker>;
    findOne(where: Record<string, any>): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Worker> & Worker & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    changePassword(userId: Types.ObjectId, password: string): Promise<{
        message: string;
    }>;
    private generateTemporalPassword;
}
