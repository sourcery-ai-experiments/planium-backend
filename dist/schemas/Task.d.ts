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
export type TaskDocument = HydratedDocument<Task>;
export declare class Task {
    title: string;
    description: string;
    status: string;
    type: string;
    supervisor: string;
    floor: string;
    cost: Record<string, any>;
    endDate: number;
    files: Types.ObjectId[];
    workerId: Types.ObjectId;
    projectId: Types.ObjectId;
    companyId: Types.ObjectId;
    createdAt: number;
    createdBy: Types.ObjectId;
    updatedAt: number;
    updatedBy: Types.ObjectId;
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, import("mongoose").Document<unknown, any, Task> & Task & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Task>> & import("mongoose").FlatRecord<Task> & {
    _id: Types.ObjectId;
}>;
