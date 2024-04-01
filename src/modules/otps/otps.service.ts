import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Otp, OtpDocument } from '@/schemas/Otp';
import { generateRandomCode } from '@/helpers/generate-data';

@Injectable()
export class OtpsService {
  constructor(
    @InjectModel(Otp.name)
    private readonly otpModel: Model<OtpDocument>,
  ) {}

  async create(otp: string, userId: Types.ObjectId) {
    try {
      const tenMinutes = 600000;

      const expiredAt = Date.now() + tenMinutes;
      const otpData = {
        otp,
        userId,
        expiredAt,
      };

      await this.otpModel.create(otpData);
    } catch (error) {
      throw new Error(error);
    }
  }

  async generateOTP(userId: Types.ObjectId) {
    const length = 5;

    const otp = generateRandomCode(length);

    await this.create(otp, userId);

    return otp;
  }

  async verifyOTP(otp: string, userId: Types.ObjectId) {
    const otpData = await this.otpModel.findOne({ otp, userId });

    if (!otpData) {
      throw new UnauthorizedException(
        'El código de verificación es incorrecto',
      );
    }

    const now = Date.now();

    if (now > otpData.expiredAt) {
      throw new UnauthorizedException('El código de verificación ha expirado');
    }

    await this.deleteAll(userId);

    return {
      message: 'OTP verificado correctamente',
    };
  }

  async deleteAll(userId: Types.ObjectId) {
    try {
      await this.otpModel.deleteMany({ userId });
    } catch (error) {
      throw new Error(error);
    }
  }
}
