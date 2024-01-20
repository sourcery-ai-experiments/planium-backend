import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
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
}
