import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '@/schemas/Task';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @Inject(REQUEST) private readonly request: Record<string, unknown>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, companyId: Types.ObjectId) {
    const userId = new Types.ObjectId(this.request.user['userId']);
    createTaskDto.projectId = new Types.ObjectId(createTaskDto.projectId);

    const existProject = await this.projectsService.findById(
      createTaskDto.projectId,
    );

    if (!existProject) {
      throw new NotFoundException('El id del proyecto no existe');
    }

    if (createTaskDto?.workerId) {
      createTaskDto.workerId = new Types.ObjectId(createTaskDto.workerId);
    }

    try {
      await this.taskModel.create({
        ...createTaskDto,
        companyId,
        workerId: createTaskDto?.workerId ? createTaskDto.workerId : userId,
        createdBy: userId,
        updatedBy: userId,
      });

      return {
        message: 'Tarea creada con éxito.',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
