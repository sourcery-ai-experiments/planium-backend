import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseBoolPipe,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyId } from '@/decorators/company-id.decorator';
import { UserTypes } from '@/decorators/auth/user-type.decorator';
import { UserType } from '@/types/User';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly workdaysService: WorkdaysService) {}

  @Get()
  @UserTypes(UserType.WORKER)
  async getAll(
    @Query('workerId', ParseMongoIdPipe) workerId: Types.ObjectId,
    @Query('isActive', new ParseBoolPipe({ optional: true }))
    isActive: boolean,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.workdaysService.getAll(isActive, workerId, companyId);
  }

  @Post()
  @UserTypes(UserType.WORKER)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createWorkdayDto: CreateWorkdayDto,
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 })],
      }),
    )
    file: Express.Multer.File,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    const workerId = new Types.ObjectId(req.user.sub);

    return await this.workdaysService.create(
      file,
      createWorkdayDto,
      workerId,
      companyId,
    );
  }

  @Patch('/end/:id')
  @UserTypes(UserType.WORKER)
  async endWorkday(
    @Param('id', ParseMongoIdPipe) workdayId: Types.ObjectId,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.workdaysService.endWorkday(
      new Types.ObjectId(workdayId),
      companyId,
    );
  }
}
