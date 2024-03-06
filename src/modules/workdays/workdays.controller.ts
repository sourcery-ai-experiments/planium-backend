import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyId } from '@/decorators/company-id.decorator';
import { UserTypes } from '@/decorators/auth/user-type.decorator';
import { UserType } from '@/types/User';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly workdaysService: WorkdaysService) {}

  @Get(':id')
  @UserTypes(UserType.WORKER)
  async getByWorkerId(
    @Param('id', ParseMongoIdPipe) workerId: Types.ObjectId,
    @Query('isActive', new ParseBoolPipe({ optional: true }))
    isActive: boolean,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.workdaysService.getWorkdaysByWorkerId(
      isActive,
      workerId,
      companyId,
    );
  }

  @Post()
  @UserTypes(UserType.WORKER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createWorkdayDto: CreateWorkdayDto,
    @Request() req: any,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    const workerId = new Types.ObjectId(req.user.sub);

    return await this.workdaysService.create(
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
