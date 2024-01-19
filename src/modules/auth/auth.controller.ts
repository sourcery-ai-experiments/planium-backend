import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from '@/decorators/auth/auth.decorator';
import { AuthService } from './auth.service';
import { SignInWorkerDto } from './dto/sign-in.dto';
import { CompanyId } from '@/decorators/auth/company-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('worker/login')
  signInWorker(@Body() signInWorkerDto: SignInWorkerDto) {
    const { email, password } = signInWorkerDto;
    return this.authService.signInWorker(email, password);
  }

  @Get('worker/validate')
  validateWorker(@Request() req) {
    const workerId = req.user.sub;

    return this.authService.validateWorkerSession(workerId);
  }

  @Get('refresh')
  refreshToken(@CompanyId() companyId: string, @Request() req) {
    const workerId = req.user.sub;
    const payload = {
      sub: workerId,
      companyId,
    };

    return this.authService.refreshToken(payload);
  }
}
