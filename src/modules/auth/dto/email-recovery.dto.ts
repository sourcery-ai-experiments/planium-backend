import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailRecoveryDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
