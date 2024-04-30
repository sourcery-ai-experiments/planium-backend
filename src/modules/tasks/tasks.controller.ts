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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyId } from '@/decorators/company-id.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { TaskStatus, TaskType } from '@/types/Task';
import { UserType } from '@/types/User';
import { UserTypes } from '@/decorators/auth/user-type.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadFilesDto } from './dto/upload-files.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAll(
    @Query('projectId', ParseMongoIdPipe) projectId: Types.ObjectId,
    @Query('workerId', ParseMongoIdPipe) workerId: Types.ObjectId,
    @Query('status', new ParseEnumPipe(TaskStatus, { optional: true }))
    status: TaskStatus,
    @Query('type', new ParseEnumPipe(TaskType, { optional: true }))
    type: TaskType,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.tasksService.getAll(
      companyId,
      projectId,
      workerId,
      status,
      type,
    );
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
    @Param('id', ParseMongoIdPipe) taskId: Types.ObjectId,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return await this.tasksService.taskReview(taskId, companyId);
  }

  @UserTypes(UserType.WORKER)
  @Patch('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  manageTaskFiles(
    @Param('id', ParseMongoIdPipe) taskId: Types.ObjectId,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: UploadFilesDto,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    const filesToDelete = body.filesToDelete?.map(
      (fileId) => new Types.ObjectId(fileId),
    );

    if (!filesToDelete && !files) {
      throw new BadRequestException(
        'Debe seleccionar al menos una imagen para subir o eliminar',
      );
    }

    return this.tasksService.manageTaskFiles(
      taskId,
      companyId,
      files,
      filesToDelete,
    );
  }
}
