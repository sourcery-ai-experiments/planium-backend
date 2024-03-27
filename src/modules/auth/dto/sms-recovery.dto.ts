import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SmsRecoveryDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
