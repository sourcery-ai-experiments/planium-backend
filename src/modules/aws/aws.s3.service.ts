import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(key: string, body: Buffer) {
    try {
      const bucket = this.configService.get('AWS_S3_BUCKET_NAME');
      const region = this.configService.get('AWS_REGION');

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
      });

      await this.s3.send(command);

      const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
      return fileUrl;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading file to S3: ${error}`,
      );
    }
  }

  async deleteFile(key: string) {
    try {
      const bucket = this.configService.get('AWS_S3_BUCKET_NAME');

      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      await this.s3.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting file from S3: ${error}`,
      );
    }
  }
}
