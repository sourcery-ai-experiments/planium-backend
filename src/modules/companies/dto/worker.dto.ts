import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class WorkerDto {
  @ApiProperty()
  @IsNotEmpty()
  salary: string;

  @ApiProperty()
  @IsMongoId()
  workerId: Types.ObjectId;
}

export class RemoveWorkerDto {
  @ApiProperty()
  @IsMongoId()
  workerId: Types.ObjectId;
}
