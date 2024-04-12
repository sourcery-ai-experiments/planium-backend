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
import { Model, Types, ClientSession } from 'mongoose';
import { UserDocument } from '@/schemas/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesService } from '../files/files.service';
import { Folder } from '@/types/File';
export declare class UsersService {
    private readonly userModel;
    private readonly filesService;
    constructor(userModel: Model<UserDocument>, filesService: FilesService);
    findById(id: Types.ObjectId): Promise<UserDocument>;
    findOne(where: Record<string, any>): Promise<UserDocument>;
    create(user: CreateUserDto, session?: ClientSession | null): Promise<{
        message: string;
        data: {
            _id: Types.ObjectId;
            __v?: any;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove";
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection<import("bson").Document>;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
                [x: string]: any;
            }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
                [x: string]: any;
            }>> & import("mongoose").FlatRecord<{
                [x: string]: any;
            }> & Required<{
                _id: unknown;
            }>>;
            name: string;
            username: string;
            email: string;
            countryId: Types.ObjectId;
            phone: Record<string, any>;
            type: string;
            fileId: Types.ObjectId;
            companyId: Types.ObjectId;
            createdAt: number;
            updatedAt: number;
        };
    }>;
    update(id: Types.ObjectId, updateUserDto: UpdateUserDto, companyId: Types.ObjectId, session?: ClientSession | null): Promise<{
        message: string;
        data: {
            _id: Types.ObjectId;
            __v?: any;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove";
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection<import("bson").Document>;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
                [x: string]: any;
            }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
                [x: string]: any;
            }>> & import("mongoose").FlatRecord<{
                [x: string]: any;
            }> & Required<{
                _id: unknown;
            }>>;
            name: string;
            username: string;
            email: string;
            countryId: Types.ObjectId;
            phone: Record<string, any>;
            type: string;
            fileId: Types.ObjectId;
            companyId: Types.ObjectId;
            createdAt: number;
            updatedAt: number;
        };
    }>;
    changePassword(userId: Types.ObjectId, password: string): Promise<void>;
    hashPassword(password: string): Promise<any>;
    validateUserExists(user: CreateUserDto): Promise<void>;
    uploadAvatar(file: Express.Multer.File, folder: Folder, userId: Types.ObjectId, companyId: Types.ObjectId, session?: ClientSession | null): Promise<void>;
}
