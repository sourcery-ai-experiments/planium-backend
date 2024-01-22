import { Test, TestingModule } from '@nestjs/testing';
import { OtpsService } from './otp.service';

describe('OtpService', () => {
  let service: OtpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpsService],
    }).compile();

    service = module.get<OtpsService>(OtpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
