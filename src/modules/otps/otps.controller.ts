import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '@/decorators/auth/auth.decorator';
import { OtpsService } from './otps.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Types } from 'mongoose';

@Controller('otps')
export class OtpsController {
  constructor(private readonly otpService: OtpsService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @Public()
  verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    const { otp, userId } = verifyOtpDto;

    const id = new Types.ObjectId(userId);

    return this.otpService.verifyOTP(otp, id);
  }
}
