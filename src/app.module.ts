import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validate } from './config/environment.validation';
import { WorkersModule } from './modules/workers/workers.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthStatusModule } from './modules/health-status/health-status.module';
import { UsersModule } from './modules/users/users.module';
import { OtpsModule } from './modules/otps/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.DATABASE_URL || configService.get('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    WorkersModule,
    AuthModule,
    HealthStatusModule,
    UsersModule,
    OtpsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
