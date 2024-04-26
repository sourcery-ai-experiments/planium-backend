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
import { WorkdayDocument } from '@/schemas/Workday';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { ProjectsService } from '../projects/projects.service';
import { FilesService } from '../files/files.service';
export declare class WorkdaysService {
    private readonly workdayModel;
    private readonly projectsService;
    private readonly filesService;
    private readonly connection;
    constructor(workdayModel: Model<WorkdayDocument>, projectsService: ProjectsService, filesService: FilesService, connection: Connection);
    getAll(isActive: boolean, workerId: Types.ObjectId, companyId: Types.ObjectId): Promise<{
        data: any[];
    }>;
    create(file: Express.Multer.File, workday: CreateWorkdayDto, workerId: Types.ObjectId, companyId: Types.ObjectId): Promise<{
        message: string;
        data: {
            _id: Types.ObjectId;
        };
    }>;
    endWorkday(workdayId: Types.ObjectId, companyId: Types.ObjectId): Promise<{
        message: string;
    }>;
}
