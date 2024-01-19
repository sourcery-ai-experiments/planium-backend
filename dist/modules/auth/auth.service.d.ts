import { WorkersService } from '@module/workers/workers.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly workerService;
    private readonly jwtService;
    constructor(workerService: WorkersService, jwtService: JwtService);
    signInWorker(email: string, password: string): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    comparePasswords(password: string, storedPasswordHash: string): Promise<any>;
    validateWorkerSession(workerId: string): Promise<{
        message: string;
        data: import("../../schemas/Worker").Worker;
    }>;
    refreshToken(payload: object): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
}
