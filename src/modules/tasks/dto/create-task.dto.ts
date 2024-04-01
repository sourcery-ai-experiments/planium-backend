import {
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { TaskType } from '@/types/Task';

class Cost {
  @ApiPropertyOptional()
  @IsOptional()
  amount: string;
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
  endDate: number;

  @ApiProperty()
  @IsEnum(TaskType)
  type: TaskType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  workerId: Types.ObjectId;

  @ApiProperty()
  @IsMongoId()
  projectId: Types.ObjectId;
}
