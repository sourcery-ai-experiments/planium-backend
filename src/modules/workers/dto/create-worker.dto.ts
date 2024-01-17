import {
  IsNotEmpty,
  IsEmpty,
  IsEmail,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Phone {
  @ApiProperty()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;
}
class PersonalInformation {
  @ApiProperty()
  @IsEmpty()
  socialSecurityNumber: string;

  @ApiProperty()
  @IsEmpty()
  @IsMongoId()
  fileId: string;
}

class EmergencyContact {
  @ApiProperty()
  @IsEmpty()
  name: string;

  @ApiProperty()
  @IsEmpty()
  phone: string;

  @ApiProperty()
  @IsEmpty()
  phoneCode: string;
}

export class CreateWorkerDto {
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

  @ApiPropertyOptional()
  @IsEmpty()
  @ValidateNested()
  @Type(() => PersonalInformation)
  personalInformation: PersonalInformation;

  @ApiPropertyOptional()
  @IsEmpty()
  @ValidateNested()
  @Type(() => EmergencyContact)
  emergencyContact: EmergencyContact;

  @ApiPropertyOptional()
  @IsEmpty()
  @IsMongoId()
  fileId: string;
}
