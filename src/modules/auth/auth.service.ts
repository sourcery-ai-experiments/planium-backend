import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { OtpsService } from '../otps/otps.service';
import { SesService } from '../aws/aws.ses.service';
import { SnsService } from '../aws/aws.sns.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpsService,
    private readonly sesService: SesService,
    private readonly snsService: SnsService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.comparePasswords(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Logueado correctamente',
      data: {
        access_token: token,
      },
    };
  }

  async comparePasswords(password: string, storedPasswordHash: string) {
    return bcrypt.compare(password, storedPasswordHash);
  }

  async validateSession(userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('No se encontró el usuario');
    }

    return {
      message: 'Usuario verificado correctamente',
      data: user,
    };
  }

  async refreshToken(payload: object) {
    const token = this.jwtService.sign(payload);

    return {
      message: 'Token actualizado',
      data: {
        access_token: token,
      },
    };
  }

  async sendRecoverySms(phone: string, countryCode: string) {
    const user = await this.userService.findOne({
      'phone.number': phone,
      'phone.countryCode': countryCode,
    });

    if (!user) {
      throw new UnauthorizedException(
        'El número de teléfono no está registrado',
      );
    }

    const otp = await this.otpService.generateOTP(user._id);

    await this.snsService.publishSmsToPhone(
      `+${countryCode}${phone}`,
      `Tu código de recuperación es ${otp}`,
    );

    return {
      message: 'SMS enviado correctamente',
      data: {
        userId: user._id,
      },
    };
  }

  sendRecoveryEmail = async (email: string) => {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(
        'El correo electrónico no está registrado',
      );
    }

    const otp = await this.otpService.generateOTP(user._id);

    await this.sesService.sendEmail(
      email,
      'Recuperación de contraseña',
      `Tu código de recuperación es ${otp}`,
    );

    return {
      message: 'Email enviado correctamente',
      data: {
        userId: user._id,
      },
    };
  };

  async verifyRecoveryCode(otp: string, userId: string) {
    const response = await this.otpService.verifyOTP(
      otp,
      new Types.ObjectId(userId),
    );

    return {
      message: response.message,
    };
  }
}
