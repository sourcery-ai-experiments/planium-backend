/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, getConnectionToken } from '@nestjs/mongoose';
import { Worker } from '@/schemas/Worker';
import { UsersService } from '@module/users/users.service';
import { WorkersService } from './workers.service';
import { ProjectsService } from '../projects/projects.service';
import { CompaniesService } from '../companies/companies.service';
import { SesService } from '../aws/aws.ses.service';
import { FilesService } from '../files/files.service';
import { Types } from 'mongoose';

describe('WorkersService', () => {
  let service: WorkersService;

  const mockUserService = {
    create: jest.fn().mockImplementation((dto) => ({
      message: 'Usuario creado correctamente',
      data: {
        _id: '507f1f77bcf86cd799439011',
        ...dto,
      },
    })),
    update: jest.fn().mockImplementation((id, dto) => ({
      message: 'Operario actualizado correctamente',
    })),
  };

  const mockSesService = {
    sendEmail: jest.fn().mockResolvedValue(null),
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

  const mockProjectService = {
    addWorkers: jest.fn().mockResolvedValue(null),
  };

  const mockCompanyService = {
    findById: jest.fn().mockImplementation((id) => ({
      ...id,
    })),
  };

  const workerList = [
    {
      id: '507f1f77bcf86cd799439011',
      name: 'Daniel Diaz',
      email: 'daniel.mock@gmail.com',
    },
    {
      id: '507f1f77bcf86cd799439012',
      name: 'Juan Diaz',
      email: 'juan.mock@gmail.com',
    },
  ];

  const mockWorkerModel = {
    create: jest.fn().mockImplementation((dto) => [
      {
        _id: '507f1f77bcf86cd799439011',
        ...dto,
      },
    ]),
    find: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(workerList),
    })),
    findById: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue(workerList[0]),
    })),
    findOne: jest.fn().mockImplementation((where) => ({
      exec: jest.fn().mockResolvedValue(workerList[0]),
    })),
    aggregate: jest.fn().mockImplementation(() => workerList),
    updateOne: jest.fn(),
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
        WorkersService,
        {
          provide: getModelToken(Worker.name),
          useValue: mockWorkerModel,
        },
        UsersService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
        {
          provide: ProjectsService,
          useValue: mockProjectService,
        },
        {
          provide: CompaniesService,
          useValue: mockCompanyService,
        },
        {
          provide: SesService,
          useValue: mockSesService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a worker', async () => {
    const dto = {
      name: 'Pepe Díaz',
      username: 'pepe.diaz',
      email: 'pepe@gmail.com',
      password: '12345678',
      countryId: '65b91a6499763086e5900fd3',
      projectId: new Types.ObjectId(),
    };
    const companyId = new Types.ObjectId();

    expect(await service.create(dto, companyId)).toEqual({
      message: 'Operario creado correctamente',
    });
  });

  it('should return all workers', async () => {
    expect(await service.findAll()).toEqual(workerList);
  });

  it('should return a worker by id', async () => {
    expect(await service.findById('507f1f77bcf86cd799439011')).toEqual(
      workerList[0],
    );
  });

  it('should return a worker by email', async () => {
    expect(await service.findOne({ email: 'daniel.mock@gmail.com' })).toEqual(
      workerList[0],
    );
  });

  it('should update a worker', async () => {
    const workerId = new Types.ObjectId();
    const companyId = new Types.ObjectId();
    const updateWorkerDto = {
      name: 'Pepe Diaz',
      email: 'pepe@gmail.com',
    } as any;

    expect(await service.update(workerId, updateWorkerDto, companyId)).toEqual({
      message: 'Operario actualizado correctamente',
    });
  });
});
