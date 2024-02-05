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
import { HydratedDocument, Types } from 'mongoose';
export type WorkerDocument = HydratedDocument<Worker>;
export declare class Worker {
    personalInformation: Record<string, any>;
    emergencyContact: Record<string, any>;
    userId: Types.ObjectId;
    createdAt: number;
    updatedAt: number;
}
export declare const WorkerSchema: import("mongoose").Schema<Worker, import("mongoose").Model<Worker, any, any, any, import("mongoose").Document<unknown, any, Worker> & Worker & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Worker, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Worker>> & import("mongoose").FlatRecord<Worker> & {
    _id: Types.ObjectId;
}>;
