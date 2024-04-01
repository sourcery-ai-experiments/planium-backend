import { Module } from '@nestjs/common';
import { S3Service } from './aws.s3.service';
import { SesService } from './aws.ses.service';
import { SnsService } from './aws.sns.service';

@Module({
  providers: [S3Service, SesService, SnsService],
  exports: [S3Service, SesService, SnsService],
})
export class AwsModule {}
