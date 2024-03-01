import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Task } from '@/schemas/Task';
import { TasksService } from './tasks.service';
import { ProjectsService } from '../projects/projects.service';
import { REQUEST } from '@nestjs/core';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@/types/Task';

describe('TasksService', () => {
  let service: TasksService;

  const taskReviewDto = {
    files: ['65caab8202307d74ac4d110d', '65cab1470068980f35646d77'],
  };
  const taskId = new Types.ObjectId();
  const companyId = new Types.ObjectId();

  const projectList = [
    {
      id: new Types.ObjectId(),
      name: 'Project 1',
    },
    {
      id: new Types.ObjectId(),
      name: 'Project 2',
    },
  ];

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
          provide: REQUEST,
          useValue: {
            user: {
              userId: '507f1f77bcf86cd799439011',
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto = {
      title: 'Tarea 3',
      description: 'Esta es la tarea 3',
      supervisor: 'Pepe Díaz',
      floor: 'Piso 20',
      startDate: 1707277689782,
      endDate: 1707434865116,
      projectId: new Types.ObjectId(),
    };

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
    expect(
      await service.taskReview(taskReviewDto.files, taskId, companyId),
    ).toEqual({
      message: 'Tarea enviada para revisión.',
    });
  });

  it('should return an exception when task does not exist when try to review', async () => {
    mockTaskModel.findOne.mockResolvedValue(null);

    await expect(
      service.taskReview(taskReviewDto.files, taskId, companyId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return an exception when task is waiting for approval', async () => {
    mockTaskModel.findOne.mockResolvedValue({
      status: TaskStatus.WAITING_APPROVAL,
    });

    await expect(
      service.taskReview(taskReviewDto.files, taskId, companyId),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return an exception when task is already DONE', async () => {
    mockTaskModel.findOne.mockResolvedValue({
      status: TaskStatus.DONE,
    });

    await expect(
      service.taskReview(taskReviewDto.files, taskId, companyId),
    ).rejects.toThrow(BadRequestException);
  });
});
