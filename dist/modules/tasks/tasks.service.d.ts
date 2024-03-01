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
import { Model, Types } from 'mongoose';
import { TaskDocument } from '@/schemas/Task';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { TaskStatus, TaskType } from '@/types/Task';
export declare class TasksService {
    private readonly taskModel;
    private readonly request;
    private readonly projectsService;
    constructor(taskModel: Model<TaskDocument>, request: Record<string, unknown>, projectsService: ProjectsService);
    create(createTaskDto: CreateTaskDto, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    getAll(companyId: Types.ObjectId, projectId: Types.ObjectId, status: TaskStatus, type: TaskType): Promise<any[]>;
    getById(taskId: Types.ObjectId, companyId: Types.ObjectId): Promise<any[]>;
    taskReview(files: string[], taskId: Types.ObjectId, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    private verifyExistProject;
}
