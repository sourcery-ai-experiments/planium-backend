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
import { Model } from 'mongoose';
import { Worker, WorkerDocument } from '@schema/Worker';
import { UsersService } from '@module/users/users.service';
import { CreateWorkerDto } from '@module/workers/dto/create-worker.dto';
export declare class WorkersService {
    private readonly workerModel;
    private readonly userService;
    constructor(workerModel: Model<WorkerDocument>, userService: UsersService);
    create(worker: CreateWorkerDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, password: string): Promise<{
        message: string;
    }>;
    findAll(): Promise<Worker[]>;
    findById(id: string): Promise<Worker>;
    findOne(where: Record<string, any>): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Worker> & Worker & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Worker> & Worker & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
