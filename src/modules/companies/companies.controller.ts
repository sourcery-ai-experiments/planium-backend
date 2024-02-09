import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyId } from '@/decorators/company-id.decorator';
import { UserTypes } from '@/decorators/auth/user-type.decorator';
import { UserType } from '@/types/User';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { CompaniesService } from './companies.service';
import { WorkerDto, RemoveWorkerDto } from './dto/worker.dto';
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('by-worker/:id')
  async findAllByWorkerId(
    @Param('id', ParseMongoIdPipe) workerId: Types.ObjectId,
  ) {
    return this.companiesService.findAllByWorkerId(workerId);
  }

  @Patch('workers/add')
  @UserTypes(UserType.COMPANY_USER)
  async addWorker(
    @Body() worker: WorkerDto,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    worker.workerId = new Types.ObjectId(worker.workerId);

    return this.companiesService.addWorker(companyId, worker);
  }

  @Patch('workers/remove')
  @UserTypes(UserType.COMPANY_USER)
  async removeWorker(
    @Body() worker: RemoveWorkerDto,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    worker.workerId = new Types.ObjectId(worker.workerId);

    return this.companiesService.removeWorker(companyId, worker.workerId);
  }

  @Patch('workers/update')
  @UserTypes(UserType.COMPANY_USER)
  async updateWorker(
    @Body() worker: WorkerDto,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    worker.workerId = new Types.ObjectId(worker.workerId);

    return this.companiesService.updateWorker(companyId, worker);
  }
}
