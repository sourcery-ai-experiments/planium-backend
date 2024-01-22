import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { Otp, OtpDocument } from '@/schemas/Otp';

@Injectable()
export class OtpsService {
  constructor(
    @InjectModel(Otp.name)
    private readonly otpModel: Model<OtpDocument>,
  ) {}

  async create(otp: string, userId: Types.ObjectId) {
    try {
      const oneMinute = 60000;

      const expiredAt = Date.now() + oneMinute;
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

    const buffer = randomBytes(length);

    let otp = '';
    for (let i = 0; i < length; i++) {
      const digit = buffer[i] % 10;
      otp += digit.toString();
    }

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
      message: 'Código de verificación correcto',
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
