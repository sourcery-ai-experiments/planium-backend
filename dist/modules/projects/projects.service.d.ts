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
import { Project, ProjectDocument } from '@schema/Project';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsService {
    private readonly projectModel;
    private readonly request;
    constructor(projectModel: Model<ProjectDocument>, request: Record<string, unknown>);
    create(createProjectDto: CreateProjectDto, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
    findById(id: Types.ObjectId): Promise<Project>;
    getByWorkerId(workerId: Types.ObjectId, companyId: Types.ObjectId): Promise<any[]>;
    addWorkers(projectId: Types.ObjectId, workers: string[], companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
}
