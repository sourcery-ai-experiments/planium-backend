/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;

  const taskList = [
    {
      id: '1',
      title: 'Task 1',
    },
    {
      id: '2',
      title: 'Task 2',
    },
  ];

  const mockTasksService = {
    create: jest.fn().mockImplementation((createTaskDto, companyId) => ({
      message: 'Tarea creada con éxito.',
    })),
    getById: jest.fn().mockImplementation((taskId, companyId) => taskList[0]),
    taskReview: jest.fn().mockImplementation((files, taskId, companyId) => ({
      message: 'Tarea enviada para revisión.',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Tarea 3',
      description: 'Esta es la tarea 3',
      supervisor: 'Pepe Díaz',
      floor: 'Piso 20',
      startDate: 1707277689782,
      endDate: 1707434865116,
      projectId: new Types.ObjectId(),
    };

    const companyId = new Types.ObjectId();

    expect(await controller.create(createTaskDto, companyId)).toEqual({
      message: 'Tarea creada con éxito.',
    });

    expect(mockTasksService.create).toHaveBeenCalledWith(
      createTaskDto,
      companyId,
    );
  });

  it('should get a task by id', async () => {
    const taskId = new Types.ObjectId();
    const companyId = new Types.ObjectId();

    expect(await controller.getTaskById(taskId, companyId)).toEqual(
      taskList[0],
    );
  });

  it('should review a task', async () => {
    const taskReviewDto = {
      files: ['65caab8202307d74ac4d110d', '65cab1470068980f35646d77'],
    };
    const taskId = new Types.ObjectId();
    const companyId = new Types.ObjectId();

    expect(
      await controller.taskReview(taskReviewDto, taskId, companyId),
    ).toEqual({
      message: 'Tarea enviada para revisión.',
    });

    expect(mockTasksService.taskReview).toHaveBeenCalledWith(
      taskReviewDto.files,
      taskId,
      companyId,
    );
  });
});
