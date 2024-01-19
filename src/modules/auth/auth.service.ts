import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { WorkersService } from '@module/workers/workers.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly workerService: WorkersService,
    private readonly jwtService: JwtService,
  ) {}

  async signInWorker(email: string, password: string) {
    const worker = await this.workerService.findOne({ email });

    if (!worker) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.comparePasswords(password, worker.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: worker._id,
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
}
