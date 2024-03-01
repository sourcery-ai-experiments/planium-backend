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
import { Types } from 'mongoose';
import { AuthService } from './auth.service';
import { VerifyCodeDto, EmailRecoveryDto, SignInDto, SmsRecoveryDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(signInUserDto: SignInDto): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    validateUser(req: any, companyId: Types.ObjectId): Promise<{
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
    refreshToken(companyId: Types.ObjectId, req: any): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    sendRecoverySms(smsRecoveryDto: SmsRecoveryDto): Promise<{
        message: string;
        data: {
            userId: Types.ObjectId;
        };
    }>;
    sendRecoveryEmail(emailRecoveryDto: EmailRecoveryDto): Promise<{
        message: string;
        data: {
            userId: Types.ObjectId;
        };
    }>;
    verifyRecoveryCode(verifyCodeDto: VerifyCodeDto): Promise<{
        message: string;
    }>;
}
