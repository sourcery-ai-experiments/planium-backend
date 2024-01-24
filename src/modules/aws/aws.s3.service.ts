import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

  async uploadFile(key: string, body: Buffer, folder: string) {
    const bucket = this.configService.get('AWS_BUCKET_NAME');
    const region = this.configService.get('AWS_REGION');
    const newKey = `${folder}/${key}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: newKey,
      Body: body,
    });

    await this.s3.send(command);

    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${newKey}`;
    return fileUrl;
  }
}
