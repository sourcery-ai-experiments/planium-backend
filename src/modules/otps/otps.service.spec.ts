import { Test, TestingModule } from '@nestjs/testing';
import { OtpsService } from './otps.service';
import { getModelToken } from '@nestjs/mongoose';
import { Otp } from '@/schemas/Otp';
import { Types } from 'mongoose';

describe('OtpService', () => {
  let service: OtpsService;

  const otpList = [
    {
      otp: '20840',
      userId: '507f1f77bcf86cd799439011',
      expiredAt: Date.now(),
    },
    {
      otp: '20840',
      userId: '507f1f77bcf86cd799439012',
      expiredAt: Date.now(),
    },
  ];

  const mockOtpModel = {
    create: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(otpList[0]),
    deleteAll: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpsService,
        {
          provide: getModelToken(Otp.name),
          useValue: mockOtpModel,
        },
      ],
    }).compile();

    service = module.get<OtpsService>(OtpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an otp', async () => {
    const otp = '20840';
    const userId = new Types.ObjectId();

    expect(await service.create(otp, userId)).toBeUndefined();
    expect(mockOtpModel.create).toHaveBeenCalled();
  });
});
