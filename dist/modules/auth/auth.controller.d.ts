import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SmsRecoveryDto } from './dto/sms-recovery.dto';
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
        data: {
            otp: string;
        };
    }>;
}
