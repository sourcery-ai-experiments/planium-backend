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
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { OtpsService } from '../otps/otps.service';
import { SesService } from '../aws/aws.ses.service';
import { SnsService } from '../aws/aws.sns.service';
import { CompanyUsersService } from '@module/company_users/company_users.service';
import { WorkersService } from '@/modules/workers/workers.service';
import { UserDocument } from '@/schemas/User';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly otpService;
    private readonly sesService;
    private readonly snsService;
    private readonly companyUserService;
    private readonly workerService;
    constructor(userService: UsersService, jwtService: JwtService, otpService: OtpsService, sesService: SesService, snsService: SnsService, companyUserService: CompanyUsersService, workerService: WorkersService);
    signIn(username: string, password: string): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    comparePasswords(password: string, storedPasswordHash: string): Promise<any>;
    validateSession(userId: Types.ObjectId, companyId: Types.ObjectId): Promise<{
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
            schema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
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
            countryId: string;
            phone: Record<string, any>;
            type: string;
            fileId: Types.ObjectId;
        };
    }>;
    refreshToken(payload: object): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    sendRecoverySms(phone: string, countryCode: string): Promise<{
        message: string;
        data: {
            userId: Types.ObjectId;
        };
    }>;
    sendRecoveryEmail: (email: string) => Promise<{
        message: string;
        data: {
            userId: Types.ObjectId;
        };
    }>;
    verifyRecoveryCode(otp: string, userId: string): Promise<{
        message: string;
    }>;
    getPayload(user: UserDocument): Promise<{}>;
}
