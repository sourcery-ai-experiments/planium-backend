import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from '@/guards/auth/auth.guard';
import { UserTypeGuard } from '@/guards/auth/user-type.guard';
import { UsersModule } from '@module/users/users.module';
import { OtpsModule } from '@module/otps/otps.module';
import { AwsModule } from '@module/aws/aws.module';
import { CompanyUsersModule } from '../company_users/company_users.module';
import { WorkersModule } from '../workers/workers.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    OtpsModule,
    AwsModule,
    CompanyUsersModule,
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
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: UserTypeGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
