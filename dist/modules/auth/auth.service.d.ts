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
    signIn(email: string, password: string): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    comparePasswords(password: string, storedPasswordHash: string): Promise<any>;
    validateSession(userId: Types.ObjectId): Promise<{
        message: string;
        data: {
            name: string;
            email: string;
            countryId: string;
            phone: Record<string, any>;
            fileId: Types.ObjectId;
            type: string;
            _id: Types.ObjectId;
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
