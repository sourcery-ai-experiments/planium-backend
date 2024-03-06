import { IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkdayType } from '@/types/Workday';
import { Types } from 'mongoose';

export class CreateWorkdayDto {
  @ApiProperty()
  @IsEnum(WorkdayType)
  type: WorkdayType;

  @ApiProperty()
  @IsMongoId()
  projectId: Types.ObjectId;
}
