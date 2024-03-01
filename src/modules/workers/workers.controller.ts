import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Public } from '@/decorators/auth/auth.decorator';
import { UserTypes } from '@/decorators/auth/user-type.decorator';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { CompanyId } from '@/decorators/company-id.decorator';
import { WorkersService } from './workers.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UserType } from '@/types/User';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('workers')
@UserTypes(UserType.COMPANY_USER)
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

  @Public()
  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const { userId, password } = changePasswordDto;

    return this.workersService.changePassword(
      new Types.ObjectId(userId),
      password,
    );
  }
}
