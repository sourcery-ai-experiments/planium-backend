import { Injectable } from '@nestjs/common';
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
    const key = renameFile(originalName);
    const newKey = `${folder}/${key}`;

    const imageUrl = await this.s3Service.uploadFile(newKey, body);

    const newFile = await this.fileModel.create({
      url: imageUrl,
      key: newKey,
      companyId,
    });

    return {
      id: newFile._id,
      url: newFile.url,
    };
  }
}
