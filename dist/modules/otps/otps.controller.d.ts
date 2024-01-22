import { OtpsService } from './otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class OtpsController {
    private readonly otpService;
    constructor(otpService: OtpsService);
    verifyOTP(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
    }>;
}
