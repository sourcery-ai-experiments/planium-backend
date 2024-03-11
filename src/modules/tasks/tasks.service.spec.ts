/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Task } from '@/schemas/Task';
import { TasksService } from './tasks.service';
import { ProjectsService } from '../projects/projects.service';
import { FilesService } from '../files/files.service';
import { REQUEST } from '@nestjs/core';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TaskStatus, TaskType } from '@/types/Task';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;

  const taskId = new Types.ObjectId();
  const companyId = new Types.ObjectId();

  const taskDocument: any = {
    _id: taskId,
    files: [],
    save: jest.fn(),
  };

  const projectList = [
    {
      id: new Types.ObjectId(),
      name: 'Project 1',
      workers: [new Types.ObjectId()],
    },
    {
      id: new Types.ObjectId(),
      name: 'Project 2',
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

  const mockConnection = {
    startSession: jest.fn().mockImplementation(() => ({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn().mockResolvedValue(null),
      abortTransaction: jest.fn().mockResolvedValue(null),
      endSession: jest.fn().mockResolvedValue(null),
    })),
  };

  const projectsService = {
    findById: jest.fn().mockResolvedValue(projectList[0]),
  };

  const mockTaskModel = {
    create: jest.fn(),
    findOne: jest.fn().mockResolvedValue({
      data: projectList[0],
      save: jest.fn(),
    }),
    aggregate: jest.fn().mockResolvedValue(projectList),
    updateOne: jest.fn().mockResolvedValue(null),
  };

  const mockFilesService = {
    uploadOneFile: jest
      .fn()
      .mockImplementation(
        (
          originalname: string,
          body: Buffer,
          folder: string,
          companyId: Types.ObjectId,
        ) => ({
          id: new Types.ObjectId(),
          url: `https://s3.amazonaws.com/${folder}/${originalname}`,
        }),
      ),
    uploadManyFiles: jest
      .fn()
      .mockImplementation(
        (
          files: Express.Multer.File[],
          folder: string,
          companyId: Types.ObjectId,
        ) => [
          {
            id: new Types.ObjectId(),
            url: `https://s3.amazonaws.com/${folder}/${files[0].originalname}`,
          },
        ],
      ),
    deleteManyFiles: jest
      .fn()
      .mockImplementation((filesToDelete: Types.ObjectId[]) => null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
        {
          provide: ProjectsService,
          useValue: projectsService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: REQUEST,
          useValue: {
            user: {
              userId: '507f1f77bcf86cd799439011',
            },
          },
        },
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    jest.spyOn(service, 'verifyWorkerIsInProject').mockResolvedValue(null);

    expect(await service.create(createTaskDto, companyId)).toEqual({
      message: 'Tarea creada con éxito.',
    });

    expect(mockTaskModel.create).toHaveBeenCalledWith({
      ...createTaskDto,
      companyId,
      workerId: expect.any(Types.ObjectId),
      createdBy: expect.any(Types.ObjectId),
      updatedBy: expect.any(Types.ObjectId),
    });
  });

  it('should review a task', async () => {
    taskDocument.status = TaskStatus.IN_PROGRESS;

    jest.spyOn(service, 'verifyTaskExist').mockResolvedValue(taskDocument);

    expect(await service.taskReview(taskId, companyId)).toEqual({
      message: 'Tarea enviada para revisión.',
    });
  });

  it('should return an exception when task does not exist when try to review', async () => {
    mockTaskModel.findOne.mockResolvedValue(null);

    await expect(service.taskReview(taskId, companyId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return an exception when task is waiting for approval', async () => {
    mockTaskModel.findOne.mockResolvedValue({
      status: TaskStatus.WAITING_APPROVAL,
    });

    await expect(service.taskReview(taskId, companyId)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return an exception when task is already DONE', async () => {
    mockTaskModel.findOne.mockResolvedValue({
      status: TaskStatus.DONE,
    });

    await expect(service.taskReview(taskId, companyId)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an exception when verify worker is not in project', async () => {
    jest.spyOn(projectsService, 'findById').mockResolvedValue(projectList[0]);

    await expect(
      service.verifyWorkerIsInProject(
        new Types.ObjectId(),
        new Types.ObjectId(),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should manage task files', async () => {
    const filesToDelete = [new Types.ObjectId()];

    jest.spyOn(service, 'verifyTaskExist').mockResolvedValue(taskDocument);

    expect(
      await service.manageTaskFiles(taskId, companyId, files, filesToDelete),
    ).toEqual({
      message: 'Imagenes actualizadas con éxito.',
    });
  });

  it('should start a task', async () => {
    taskDocument.status = TaskStatus.TO_DO;
    jest.spyOn(service, 'verifyTaskExist').mockResolvedValue(taskDocument);

    expect(await service.startTask(taskId, files[0], companyId)).toEqual({
      message: 'Tarea iniciada.',
    });
  });

  it('should return an exception when project does not exist when start a task', async () => {
    mockTaskModel.findOne.mockResolvedValue(null);

    await expect(
      service.startTask(taskId, files[0], companyId),
    ).rejects.toThrow(NotFoundException);
  });
});
