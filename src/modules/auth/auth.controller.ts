import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { CompanyId } from '@/decorators/auth/company-id.decorator';
import { Public } from '@/decorators/auth/auth.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SmsRecoveryDto } from './dto/sms-recovery.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInUserDto: SignInDto) {
    const { email, password } = signInUserDto;
    return this.authService.signIn(email, password);
  }

  @Get('validate')
  validateUser(@Request() req) {
    const userId = req.user.sub;

    return this.authService.validateSession(userId);
  }

  @Get('refresh')
  refreshToken(@CompanyId() companyId: string, @Request() req) {
    const userId = req.user.sub;
    const payload = {
      sub: userId,
      companyId,
    };

    return this.authService.refreshToken(payload);
  }

  @Public()
  @Post('recovery/sms')
  sendRecoverySms(@Body() smsRecoveryDto: SmsRecoveryDto) {
    const { phone } = smsRecoveryDto;

    return this.authService.sendRecoverySms(phone);
  }
}
