import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsMongoId()
  userId: string;
}
