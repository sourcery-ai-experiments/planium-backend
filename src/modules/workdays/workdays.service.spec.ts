/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkdaysService } from './workdays.service';
import { WorkersService } from '@module/workers/workers.service';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Workday } from '@/schemas/Workday';
import { WorkdayType } from '@/types/Workday';
import { FilesService } from '../files/files.service';
import { ProjectsService } from '../projects/projects.service';

describe('WorkdaysService', () => {
  let service: WorkdaysService;

  const mockWorkersService = {
    findOne: jest.fn().mockImplementation((id: Types.ObjectId) => ({
      id,
      name: 'Daniel Diaz',
    })),
  };

  const mockProjectsService = {
    findOne: jest.fn().mockImplementation((where: Record<string, unknown>) => ({
      where,
    })),
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
  };

  const mockWorkdayModel = {
    create: jest.fn().mockImplementation((dto) => ({
      dto,
    })),
    find: jest.fn().mockImplementation((where: Record<string, any>) => ({
      where,
    })),
    findOne: jest.fn().mockImplementation((where: Record<string, any>) => ({
      where,
      isActive: true,
    })),
    updateOne: jest
      .fn()
      .mockImplementation(
        (where: Record<string, any>, update: Record<string, any>) => ({
          where,
          update,
        }),
      ),
  };

  const mockConnection = {
    startSession: jest.fn().mockImplementation(() => ({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn().mockResolvedValue(null),
      abortTransaction: jest.fn().mockResolvedValue(null),
      endSession: jest.fn().mockResolvedValue(null),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkdaysService,
        {
          provide: WorkersService,
          useValue: mockWorkersService,
        },
        {
          provide: getModelToken(Workday.name),
          useValue: mockWorkdayModel,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<WorkdaysService>(WorkdaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a workday', async () => {
    const workerId = new Types.ObjectId();
    const companyId = new Types.ObjectId();

    const newWorkday = {
      type: WorkdayType.HOURS,
      fileId: new Types.ObjectId(),
      projectId: new Types.ObjectId(),
    };

    const file = {
      originalname: 'test.jpg',
      buffer: Buffer.from('test'),
    } as any;

    expect(await service.create(file, newWorkday, workerId, companyId)).toEqual(
      {
        message: 'Jornada creada correctamente',
      },
    );

    expect(mockWorkdayModel.create).toHaveBeenCalled();
  });

  it('should end a workday', async () => {
    const workdayId = new Types.ObjectId();
    const companyId = new Types.ObjectId();

    expect(await service.endWorkday(workdayId, companyId)).toEqual({
      message: 'Jornada finalizada correctamente',
    });
  });
});
