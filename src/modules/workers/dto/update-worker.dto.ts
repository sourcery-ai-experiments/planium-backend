import { IsOptional, ValidateNested, IsMongoId } from 'class-validator';
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
class PersonalInformation {
  @ApiPropertyOptional()
  @IsOptional()
  socialSecurityNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  fileId?: Types.ObjectId;
}

class EmergencyContact {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => Phone)
  phone: Phone;
}

export class UpdateWorkerDto {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  countryId: Types.ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  projectId: Types.ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => Phone)
  phone: Phone;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalInformation)
  personalInformation: PersonalInformation;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContact)
  emergencyContact: EmergencyContact;
}
