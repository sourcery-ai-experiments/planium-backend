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
import { Model, Types, Connection } from 'mongoose';
import { CompanyUser, CompanyUserDocument } from '@/schemas/CompanyUser';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { UsersService } from '@/modules/users/users.service';
import { CompaniesService } from '@/modules/companies/companies.service';
export declare class CompanyUsersService {
    private readonly companyUserModel;
    private readonly usersService;
    private readonly companiesService;
    private readonly connection;
    constructor(companyUserModel: Model<CompanyUserDocument>, usersService: UsersService, companiesService: CompaniesService, connection: Connection);
    create(companyUser: CreateCompanyUserDto): Promise<{
        message: string;
    }>;
    findByUserId(userId: Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, CompanyUser> & CompanyUser & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, CompanyUser> & CompanyUser & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
}
