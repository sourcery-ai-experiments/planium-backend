import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UploadFilesDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  filesToDelete?: Types.ObjectId[];
}
