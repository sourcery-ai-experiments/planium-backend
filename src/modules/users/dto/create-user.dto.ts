import {
  IsNotEmpty,
  IsEmail,
  ValidateNested,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserType } from '@/types/User';
import { Types } from 'mongoose';

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
  @IsMongoId()
  countryId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Phone)
  phone: Phone;

  @ApiProperty()
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty()
  @IsMongoId()
  companyId: Types.ObjectId;
}
