import {
  IsEmail,
  ValidateNested,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class Phone {
  @ApiPropertyOptional()
  @IsOptional()
  number: string;

  @ApiPropertyOptional()
  @IsOptional()
  countryCode: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  countryId?: Types.ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => Phone)
  phone?: Phone;
}
