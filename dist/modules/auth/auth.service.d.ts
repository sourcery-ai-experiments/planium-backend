import { WorkersService } from '@modules/workers/workers.service';
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
    private comparePasswords;
}
