import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyId } from '@/decorators/company-id.decorator';
import { UserTypes } from '@/decorators/auth/user-type.decorator';
import { UserType } from '@/types/User';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddWorkersDto } from './dto/add-workers.dto';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';

@Controller('projects')
@UserTypes(UserType.COMPANY_USER)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.projectsService.create(createProjectDto, companyId);
  }

  @Get('by-worker/:id')
  async getByWorkerId(
    @Param('id', ParseMongoIdPipe) workerId: Types.ObjectId,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.projectsService.getByWorkerId(workerId, companyId);
  }

  @Patch(':id/workers')
  async addWorkers(
    @Body() addWorkersDto: AddWorkersDto,
    @Param('id', ParseMongoIdPipe) projectId: Types.ObjectId,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    const { workers } = addWorkersDto;

    return await this.projectsService.addWorkers(projectId, workers, companyId);
  }
}
