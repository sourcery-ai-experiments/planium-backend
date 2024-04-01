import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpsService } from './otps.service';
import { Otp, OtpSchema } from '@/schemas/Otp';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  providers: [OtpsService],
  controllers: [],
  exports: [OtpsService],
})
export class OtpsModule {}
