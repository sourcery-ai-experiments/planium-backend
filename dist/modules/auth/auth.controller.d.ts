import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
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
}
