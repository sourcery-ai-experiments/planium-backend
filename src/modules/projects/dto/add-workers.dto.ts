import { IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddWorkersDto {
  @ApiProperty()
  @ArrayNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  workers: string[];
}
