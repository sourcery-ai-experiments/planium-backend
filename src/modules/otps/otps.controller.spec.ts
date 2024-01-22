/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { OtpsController } from './otps.controller';
import { OtpsService } from './otps.service';
import { Types } from 'mongoose';

describe('OtpsController', () => {
  let controller: OtpsController;

  const mockOtpService = {
    verifyOTP: jest
      .fn()
      .mockImplementation((otp: string, userId: Types.ObjectId) => ({
        message: 'OTP verificado correctamente',
      })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpsController],
      providers: [OtpsService],
    })
      .overrideProvider(OtpsService)
      .useValue(mockOtpService)
      .compile();

    controller = module.get<OtpsController>(OtpsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should verify an otp', async () => {
    const dto = {
      otp: '12345',
      userId: '507f1f77bcf86cd799439011',
    };

    expect(await controller.verifyOTP(dto)).toEqual({
      message: 'OTP verificado correctamente',
    });

    expect(mockOtpService.verifyOTP).toHaveBeenCalled();
  });
});
