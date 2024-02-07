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
import { CompanyId } from '@/decorators/auth/company-id.decorator';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly workdaysService: WorkdaysService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createWorkdayDto: CreateWorkdayDto,
    @Request() req: any,
    @CompanyId() companyId: string,
  ) {
    const workerId = req.user.sub;

    return await this.workdaysService.create(
      createWorkdayDto,
      new Types.ObjectId(workerId),
      new Types.ObjectId(companyId),
    );
  }

  @Patch('/end/:id')
  async endWorkday(
    @Param('id', ParseMongoIdPipe) workdayId: Types.ObjectId,
    @CompanyId() companyId: string,
  ) {
    return await this.workdaysService.endWorkday(
      new Types.ObjectId(workdayId),
      new Types.ObjectId(companyId),
    );
  }
}
