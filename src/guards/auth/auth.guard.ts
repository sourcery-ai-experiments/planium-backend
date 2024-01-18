import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/decorators/auth/auth.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.isPublicRoute(context);

      if (isPublic) return true;

      const request = context.switchToHttp().getRequest<Request>();

      const token = this.extractTokenFromRequest(request);
      if (!token) throw new UnauthorizedException('Invalid token');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || this.configService.get('JWT_SECRET'),
      });

      request['user'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  extractTokenFromRequest(request: Request): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    if (!token) throw new UnauthorizedException();
    return token;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
