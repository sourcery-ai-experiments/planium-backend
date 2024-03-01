/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from '@/schemas/Project';
import { ProjectsService } from './projects.service';
import { CompaniesService } from '@module/companies/companies.service';
import { Types } from 'mongoose';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjectModel = {};

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

  beforeEach(async () => {
    const mockCompaniesService = {
      findCompanyById: jest.fn(),
    };

    mockProjectModel = {
      create: jest.fn(),
      aggregate: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getModelToken(Project.name),
          useValue: mockProjectModel,
        },
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new project', async () => {
    const createProjectDto = {
      name: 'Nested Suites - Dorime',
      address: 'Carrera 10 #20-15',
      manager: {
        name: 'Pepe Infante',
        phone: '3002875494',
        phoneCountryCode: '57',
      },
      startDate: 1707277689782,
      endDate: 1707434865116,
    };

    const companyId = new Types.ObjectId('507f1f77bcf86cd799439022');

    jest.spyOn(service, 'create').mockResolvedValue({
      message: 'Proyecto creado correctamente',
    });

    expect(await service.create(createProjectDto, companyId)).toEqual({
      message: 'Proyecto creado correctamente',
    });

    expect(service.create).toHaveBeenCalled();
  });

  it('should find all projects by worker id', async () => {
    const workerId = new Types.ObjectId();
    const companyId = new Types.ObjectId();

    jest.spyOn(service, 'getByWorkerId').mockResolvedValue(projectList);

    expect(await service.getByWorkerId(workerId, companyId)).toEqual(
      projectList,
    );
  });

  it('should add workers to a project', async () => {
    const projectId = new Types.ObjectId();
    const workers = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'];
    const companyId = new Types.ObjectId();

    jest.spyOn(service, 'addWorkers').mockResolvedValue({
      message: 'Operario(s) agregado(s) correctamente',
    });

    expect(await service.addWorkers(projectId, workers, companyId)).toEqual({
      message: 'Operario(s) agregado(s) correctamente',
    });

    expect(service.addWorkers).toHaveBeenCalledWith(
      projectId,
      workers,
      companyId,
    );
  });
});
