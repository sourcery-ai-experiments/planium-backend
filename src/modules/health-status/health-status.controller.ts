import { Controller, Get } from '@nestjs/common';
import { Public } from '@/decorators/auth/auth.decorator';

@Controller('health-status')
export class HealthStatusController {
  @Get()
  @Public()
  checkHealth() {
    return { status: 'OK' };
  }
}
