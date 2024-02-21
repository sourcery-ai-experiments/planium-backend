import { Controller, Get, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { CompaniesService } from './companies.service';
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('by-worker/:id')
  async findAllByWorkerId(
    @Param('id', ParseMongoIdPipe) workerId: Types.ObjectId,
  ) {
    return this.companiesService.findAllByWorkerId(workerId);
  }
}
