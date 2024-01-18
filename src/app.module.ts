import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validate } from './config/environment.validation';
import { WorkersModule } from './modules/workers/workers.module';
import { AuthModule } from './modules/auth/auth.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
