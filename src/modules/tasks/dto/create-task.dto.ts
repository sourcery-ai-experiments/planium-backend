import {
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class Cost {
  @ApiPropertyOptional()
  @IsOptional()
  amount: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPaid: boolean;
}

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  supervisor: string;

  @ApiProperty()
  @IsNotEmpty()
  floor: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => Cost)
  cost?: Cost;

  @ApiProperty()
  @IsNumber()
  startDate: number;

  @ApiProperty()
  @IsNumber()
  endDate: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  workerId?: Types.ObjectId;

  @ApiProperty()
  @IsMongoId()
  projectId: Types.ObjectId;
}
