import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OtpsService } from '../otps/otps.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly otpService;
    constructor(userService: UsersService, jwtService: JwtService, otpService: OtpsService);
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
    sendRecoverySms(phone: string): Promise<{
        message: string;
    }>;
}
