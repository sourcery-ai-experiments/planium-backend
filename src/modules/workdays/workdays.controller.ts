import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyId } from '@/decorators/auth/company-id.decorator';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly workdaysService: WorkdaysService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createWorkdayDto: CreateWorkdayDto,
    @Request() req: any,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    const workerId = req.user.sub;

    return await this.workdaysService.create(
      createWorkdayDto,
      new Types.ObjectId(workerId),
      companyId,
    );
  }

  @Patch('/end/:id')
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
