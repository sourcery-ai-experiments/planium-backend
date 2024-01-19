import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '@/decorators/auth/auth.decorator';
import { AuthService } from './auth.service';
import { SignInWorkerDto } from './dto/sign-in.dto';

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
}
