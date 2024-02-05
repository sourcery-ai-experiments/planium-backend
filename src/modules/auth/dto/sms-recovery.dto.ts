import { IsNotEmpty, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SmsRecoveryDto {
  @ApiProperty()
  @IsMobilePhone()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  countryCode: string;
}
