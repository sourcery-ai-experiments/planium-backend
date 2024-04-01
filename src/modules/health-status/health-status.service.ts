import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthStatusService {
  checkHealth(): string {
    return 'OK';
  }
}
