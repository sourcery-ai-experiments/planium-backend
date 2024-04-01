import {
  Body,
  Controller,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Public } from '@/decorators/auth/auth.decorator';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { CompanyId } from '@/decorators/company-id.decorator';
import { WorkersService } from './workers.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  async create(
    @Body() createWorkerDto: CreateWorkerDto,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return this.workersService.create(createWorkerDto, companyId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('w9'))
  async update(
    @Param('id', ParseMongoIdPipe) workerId: Types.ObjectId,
    @Body() updateWorkerDto: UpdateWorkerDto,
    @CompanyId() companyId: Types.ObjectId,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.workersService.update(
      workerId,
      updateWorkerDto,
      companyId,
      file,
    );
  }

  @Patch('avatar/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id', ParseMongoIdPipe) workerId: Types.ObjectId,
    @CompanyId() companyId: Types.ObjectId,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.workersService.uploadAvatar(file, workerId, companyId);
  }

  @Public()
  @Patch('change-password/:id')
  async changePassword(
    @Param('id', ParseMongoIdPipe) userId: Types.ObjectId,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const { password } = changePasswordDto;

    return this.workersService.changePassword(userId, password);
  }
}
