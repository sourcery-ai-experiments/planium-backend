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
import {
  VerifyCodeDto,
  EmailRecoveryDto,
  SignInDto,
  SmsRecoveryDto,
} from './dto';

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
  validateUser(@Request() req: any) {
    const userId = req.user.userId;

    return this.authService.validateSession(userId);
  }

  @Get('refresh')
  refreshToken(@CompanyId() companyId: string, @Request() req: any) {
    // En el sub se encuentra el id del worker o company user
    const subId = req.user.sub;
    const userId = req.user.userId;
    const payload = {
      sub: subId,
      userId,
      companyId,
    };

    return this.authService.refreshToken(payload);
  }

  @Public()
  @Post('recovery/sms')
  sendRecoverySms(@Body() smsRecoveryDto: SmsRecoveryDto) {
    const { phone, countryCode } = smsRecoveryDto;

    return this.authService.sendRecoverySms(phone, countryCode);
  }

  @Public()
  @Post('recovery/email')
  sendRecoveryEmail(@Body() emailRecoveryDto: EmailRecoveryDto) {
    const { email } = emailRecoveryDto;

    return this.authService.sendRecoveryEmail(email);
  }

  @Public()
  @Post('recovery/verify')
  verifyRecoveryCode(@Body() verifyCodeDto: VerifyCodeDto) {
    const { otp, userId } = verifyCodeDto;

    return this.authService.verifyRecoveryCode(otp, userId);
  }
}
