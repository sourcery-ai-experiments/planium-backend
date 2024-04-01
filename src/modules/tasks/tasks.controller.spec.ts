/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskType } from '@/types/Task';
import { UserType } from '@/types/User';

describe('TasksController', () => {
  let controller: TasksController;

  const taskId = new Types.ObjectId();
  const companyId = new Types.ObjectId();

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

  const files: Express.Multer.File[] = [
    {
      fieldname: 'avatar',
      originalname: 'user-avatar.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './uploads/',
      filename: '12345-user-avatar.png',
      path: './uploads/12345-user-avatar.png',
      size: 1024,
      stream: null,
      buffer: null,
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
    startTask: jest.fn().mockImplementation((taskId, file, companyId) => ({
      message: 'Tarea iniciada con éxito.',
    })),
    manageTaskFiles: jest
      .fn()
      .mockImplementation((taskId, files, companyId) => ({
        message: 'Imagenes actualizadas con éxito.',
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
      type: TaskType.HOURS,
      endDate: 1707434865116,
      projectId: new Types.ObjectId(),
      workerId: new Types.ObjectId(),
    };

    const req = {
      user: { type: UserType.WORKER, sub: '65e793396b6e1c18d2bfd5c3' },
    };

    expect(await controller.create(createTaskDto, req, companyId)).toEqual({
      message: 'Tarea creada con éxito.',
    });

    expect(mockTasksService.create).toHaveBeenCalledWith(
      createTaskDto,
      companyId,
    );
  });

  it('should get a task by id', async () => {
    expect(await controller.getTaskById(taskId, companyId)).toEqual(
      taskList[0],
    );
  });

  it('should review a task', async () => {
    expect(await controller.taskReview(taskId, companyId)).toEqual({
      message: 'Tarea enviada para revisión.',
    });

    expect(mockTasksService.taskReview).toHaveBeenCalledWith(taskId, companyId);
  });

  it('should start a task', async () => {
    expect(await controller.startTask(taskId, files[0], companyId)).toEqual({
      message: 'Tarea iniciada con éxito.',
    });
  });

  it('should manage files for a task', async () => {
    const filesToDelete = [new Types.ObjectId()];

    expect(
      await controller.manageTaskFiles(
        taskId,
        files,
        { filesToDelete },
        companyId,
      ),
    ).toEqual({
      message: 'Imagenes actualizadas con éxito.',
    });
  });
});
