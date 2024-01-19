import { AuthService } from './auth.service';
import { SignInWorkerDto } from './dto/sign-in.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signInWorker(signInWorkerDto: SignInWorkerDto): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    validateWorker(req: any): Promise<{
        message: string;
        data: import("../../schemas/Worker").Worker;
    }>;
    refreshToken(companyId: string, req: any): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
}
