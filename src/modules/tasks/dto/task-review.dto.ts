import { IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskReviewDto {
  @ApiProperty()
  @ArrayNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  files: string[];
}
