import { IsNotEmpty, IsEmail, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserType } from '@/types/User';

class Phone {
  @ApiProperty()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsNotEmpty()
  countryCode: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  nationality: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Phone)
  phone: Phone;

  type: UserType;
}
