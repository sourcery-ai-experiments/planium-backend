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
import { Types } from 'mongoose';
import { WorkersService } from './workers.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
export declare class WorkersController {
    private readonly workersService;
    constructor(workersService: WorkersService);
    create(createWorkerDto: CreateWorkerDto, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    update(workerId: Types.ObjectId, updateWorkerDto: UpdateWorkerDto, companyId: Types.ObjectId, file?: Express.Multer.File): Promise<{
        message: string;
    }>;
    uploadAvatar(workerId: Types.ObjectId, companyId: Types.ObjectId, file: Express.Multer.File): Promise<{
        message: string;
    }>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
