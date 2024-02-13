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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { TaskReviewDto } from './dto/task-review.dto';

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

  @Get(':id')
  async getTaskById(
    @Param('id', ParseMongoIdPipe) taskId: Types.ObjectId,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.tasksService.getById(taskId, companyId);
  }

  @Patch('review/:id')
  async taskReview(
    @Body() taskReviewDto: TaskReviewDto,
    @Param('id', ParseMongoIdPipe) taskId: Types.ObjectId,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    const { files } = taskReviewDto;

    return await this.tasksService.taskReview(files, taskId, companyId);
  }
}
