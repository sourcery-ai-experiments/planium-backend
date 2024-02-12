import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyId } from '@/decorators/company-id.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.tasksService.create(createTaskDto, companyId);
  }
}
