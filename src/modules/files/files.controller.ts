import {
  Controller,
  MaxFileSizeValidator,
  ParseEnumPipe,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FilesService } from './files.service';
import { CompanyId } from '@/decorators/auth/company-id.decorator';
import { Folder } from '@/types/File';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-one')
  @UseInterceptors(FileInterceptor('file'))
  uploadOneFile(
    @Query('folder', new ParseEnumPipe(Folder))
    folder: Folder,
    @CompanyId() companyId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { originalname, buffer } = file;

    return this.filesService.uploadOneFile(
      originalname,
      buffer,
      folder,
      companyId,
    );
  }
}
