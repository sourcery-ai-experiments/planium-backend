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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus, TaskType } from '@/types/Task';
import { UploadFilesDto } from './dto/upload-files.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getAll(projectId: Types.ObjectId, status: TaskStatus, type: TaskType, companyId: Types.ObjectId): Promise<{
        data: any[];
    }>;
    getTaskById(taskId: Types.ObjectId, companyId: Types.ObjectId): Promise<{
        data: any;
    }>;
    create(createTaskDto: CreateTaskDto, req: any, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    startTask(taskId: Types.ObjectId, file: Express.Multer.File, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    taskReview(taskId: Types.ObjectId, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    manageTaskFiles(taskId: Types.ObjectId, files: Array<Express.Multer.File>, body: UploadFilesDto, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
}
