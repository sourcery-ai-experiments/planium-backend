import {
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsMobilePhone,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Manager {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsMobilePhone()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneCountryCode: string;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Manager)
  manager: Manager;

  @ApiProperty()
  @IsNumber()
  startDate: number;

  @ApiProperty()
  @IsNumber()
  endDate: number;
}
