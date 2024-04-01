import {
  IsNotEmpty,
  IsEmail,
  ValidateNested,
  IsMongoId,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserType } from '@/types/User';
import { Types } from 'mongoose';

class Phone {
  @ApiPropertyOptional()
  @IsOptional()
  number: string;

  @ApiPropertyOptional()
  @IsOptional()
  countryCode: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  countryId?: Types.ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => Phone)
  phone?: Phone;

  @ApiProperty()
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty()
  @IsMongoId()
  companyId: Types.ObjectId;
}
