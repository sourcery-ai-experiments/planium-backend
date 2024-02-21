import { IsNotEmpty, IsEmail, IsMongoId, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@/types/User';
import { Types } from 'mongoose';

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
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty()
  @IsMongoId()
  companyId: Types.ObjectId;
}
