import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseEnumPipe,
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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { TaskReviewDto } from './dto/task-review.dto';
import { TaskStatus, TaskType } from '@/types/Task';
import { UserType } from '@/types/User';
import { UserTypes } from '@/decorators/auth/user-type.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAll(
    @Query('projectId', ParseMongoIdPipe) projectId: Types.ObjectId,
    @Query('status', new ParseEnumPipe(TaskStatus, { optional: true }))
    status: TaskStatus,
    @Query('type', new ParseEnumPipe(TaskType, { optional: true }))
    type: TaskType,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.tasksService.getAll(companyId, projectId, status, type);
  }

  @Get(':id')
  async getTaskById(
    @Param('id', ParseMongoIdPipe) taskId: Types.ObjectId,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.tasksService.getById(taskId, companyId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: any,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    if (req.user.type === UserType.WORKER) {
      createTaskDto.workerId = new Types.ObjectId(req.user.sub);
    }

    if (!createTaskDto?.workerId) {
      throw new BadRequestException('El campo workerId es requerido');
    }

    return await this.tasksService.create(createTaskDto, companyId);
  }

  @UserTypes(UserType.WORKER)
  @Patch('start/:id')
  @UseInterceptors(FileInterceptor('file'))
  async startTask(
    @Param('id', ParseMongoIdPipe) taskId: Types.ObjectId,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 })],
      }),
    )
    file: Express.Multer.File,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.tasksService.startTask(taskId, file, companyId);
  }

  @UserTypes(UserType.WORKER)
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
