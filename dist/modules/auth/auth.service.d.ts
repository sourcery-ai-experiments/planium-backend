import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    signIn(email: string, password: string): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
    comparePasswords(password: string, storedPasswordHash: string): Promise<any>;
    validateSession(userId: string): Promise<{
        message: string;
        data: import("../../schemas/User").User;
    }>;
    refreshToken(payload: object): Promise<{
        message: string;
        data: {
            access_token: string;
        };
    }>;
}
