import { Module } from '@nestjs/common';
import { OtpsService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from '@/schemas/Otp';
import { OtpsController } from './otps.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  providers: [OtpsService],
  exports: [OtpsService],
  controllers: [OtpsController],
})
export class OtpsModule {}
