import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { OtpsService } from '../otps/otps.service';
import { SesService } from '../aws/aws.ses.service';
import { SnsService } from '../aws/aws.sns.service';
import { CompanyUsersService } from '@module/company_users/company_users.service';
import { WorkersService } from '@/modules/workers/workers.service';
import { UserType } from '@/types/User';
import { UserDocument } from '@/schemas/User';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpsService,
    private readonly sesService: SesService,
    private readonly snsService: SnsService,
    private readonly companyUserService: CompanyUsersService,
    private readonly workerService: WorkersService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isMatch = await this.comparePasswords(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = await this.getPayload(user);

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

  async validateSession(userId: Types.ObjectId) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Sesión no válida');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...userData } = user.toObject();

    return {
      message: 'Usuario verificado correctamente',
      data: userData,
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

  async getPayload(user: UserDocument) {
    let payload = {};

    if (user.type === UserType.COMPANY_USER) {
      const companyUser = await this.companyUserService.findByUserId(user._id);
      if (!companyUser) {
        throw new UnauthorizedException(
          'Usuario no tiene una empresa asignada',
        );
      }

      payload = {
        sub: companyUser._id,
        companyId: companyUser.companyId,
      };
    } else {
      const worker = await this.workerService.findOne({ userId: user._id });

      if (!worker) {
        throw new UnauthorizedException(
          'Usuario no tiene un operario asignado',
        );
      }

      payload = {
        sub: worker._id,
      };
    }

    payload['userId'] = user._id;
    payload['type'] = user.type;

    return payload;
  }
}
