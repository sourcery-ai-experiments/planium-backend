import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
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
    companyId: Types.ObjectId,
    session: ClientSession | null = null,
  ) {
    const key = renameFile(originalName);
    const newKey = `${folder}/${key}`;

    const imageUrl = await this.s3Service.uploadFile(newKey, body);

    const newFile = await this.fileModel.create(
      [
        {
          url: imageUrl,
          key: newKey,
          companyId,
        },
      ],
      { session },
    );

    return {
      id: newFile[0]._id,
      url: newFile[0].url,
    };
  }

  async deleteOneFile(
    fileId: Types.ObjectId,
    companyId: Types.ObjectId,
    session: ClientSession | null = null,
  ) {
    const file = await this.fileModel.findOneAndDelete(
      { _id: fileId, companyId },
      { session },
    );

    if (!file) {
      throw new NotFoundException('El archivo no existe');
    }

    await this.s3Service.deleteFile(file.key);
  }
}
