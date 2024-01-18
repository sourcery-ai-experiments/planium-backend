import { Controller, Get } from '@nestjs/common';
import { HealthStatusService } from './health-status.service';

@Controller('health-status')
export class HealthStatusController {
  constructor(private healthStatusService: HealthStatusService) {}

  @Get()
  check(): string {
    return this.healthStatusService.checkHealth();
  }
}
