import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyId } from '@/decorators/auth/company-id.decorator';
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
  async addWorker(@Body() worker: WorkerDto, @CompanyId() companyId: string) {
    worker.workerId = new Types.ObjectId(worker.workerId);

    return this.companiesService.addWorker(companyId, worker);
  }

  @Patch('workers/remove')
  async removeWorker(
    @Body() worker: RemoveWorkerDto,
    @CompanyId() companyId: string,
  ) {
    worker.workerId = new Types.ObjectId(worker.workerId);

    return this.companiesService.removeWorker(companyId, worker.workerId);
  }

  @Patch('workers/update')
  async updateWorker(
    @Body() worker: WorkerDto,
    @CompanyId() companyId: string,
  ) {
    worker.workerId = new Types.ObjectId(worker.workerId);

    return this.companiesService.updateWorker(companyId, worker);
  }
}