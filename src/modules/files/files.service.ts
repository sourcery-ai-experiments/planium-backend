import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Service } from '../aws/aws.s3.service';
import { File, FileDocument } from '@/schemas/File';
import { renameFile } from './helpers/rename-file.helper';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<FileDocument>,
    private readonly s3Service: S3Service,
  ) {}

  async uploadOneFile(
    originalName: string,
    body: Buffer,
    folder: string,
    companyId?: string,
  ) {
    try {
      const key = renameFile(originalName);

      const imageUrl = await this.s3Service.uploadFile(key, body, folder);

      const newFile = await this.fileModel.create({
        url: imageUrl,
        companyId,
      });

      return {
        id: newFile._id,
        url: newFile.url,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error uploading file');
    }
  }
}
