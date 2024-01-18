import { Module } from '@nestjs/common';
import { WorkersModule } from '@modules/workers/workers.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/guards/auth/auth.guard';

@Module({
  imports: [
    WorkersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET || configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn:
            process.env.JWT_EXPIRES_IN || configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
