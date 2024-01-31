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
import { Company, CompanyDocument } from '@schema/Company';
import { Worker } from '@/types/Company';
import { WorkersService } from '../workers/workers.service';
import { CreateCompanyDto } from './dto/create-company.dto';
export declare class CompaniesService {
    private readonly companyModel;
    private readonly workersService;
    constructor(companyModel: Model<CompanyDocument>, workersService: WorkersService);
    create(company: CreateCompanyDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Company> & Company & {
            _id: Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, Company> & Company & {
            _id: Types.ObjectId;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
    findAllByWorkerId(workerId: Types.ObjectId): Promise<{
        data: any[];
    }>;
    addWorker(companyId: string, worker: Worker): Promise<{
        message: string;
    }>;
    removeWorker(companyId: string, workerId: Types.ObjectId): Promise<{
        message: string;
    }>;
    updateWorker(companyId: string, worker: Worker): Promise<{
        message: string;
    }>;
    findCompany(companyId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Company> & Company & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Company> & Company & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    verifyExistsWorker(workerId: string): Promise<void>;
}
