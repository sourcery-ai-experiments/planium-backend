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
    validateUser(req: any): Promise<{
        message: string;
        data: import("../../schemas/User").User;
    }>;
    refreshToken(companyId: string, req: any): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    sendRecoverySms(smsRecoveryDto: SmsRecoveryDto): Promise<{
        message: string;
    }>;
    sendRecoveryEmail(emailRecoveryDto: EmailRecoveryDto): Promise<{
        message: string;
    }>;
    verifyRecoveryCode(verifyCodeDto: VerifyCodeDto): Promise<{
        message: string;
    }>;
}
