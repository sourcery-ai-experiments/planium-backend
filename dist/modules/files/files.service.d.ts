/// <reference types="node" />
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
import { ClientSession, Model, Types } from 'mongoose';
import { S3Service } from '../aws/aws.s3.service';
import { FileDocument } from '@/schemas/File';
export declare class FilesService {
    private readonly fileModel;
    private readonly s3Service;
    constructor(fileModel: Model<FileDocument>, s3Service: S3Service);
    uploadOneFile(originalName: string, body: Buffer, folder: string, companyId: Types.ObjectId, session?: ClientSession | null): Promise<{
        id: Types.ObjectId;
        url: string;
    }>;
    deleteOneFile(fileId: Types.ObjectId, companyId: Types.ObjectId, session?: ClientSession | null): Promise<void>;
}
