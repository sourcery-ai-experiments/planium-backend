import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompaniesService } from './companies.service';
import { Company } from '@schema/Company';
import { WorkersService } from '@/modules/workers/workers.service';
import { Types } from 'mongoose';

describe('CompaniesService', () => {
  let service: CompaniesService;

  const mockWorkersService = {
    findById: jest.fn().mockImplementation((workerId) => ({
      _id: workerId,
      name: 'Worker 1',
    })),
  };

  const mockCompanyModel = {
    create: jest.fn().mockImplementation((dto) => ({
      id: '507f1f77bcf86cd799439011',
      ...dto,
    })),
    aggregate: jest.fn().mockImplementation(() => [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'Company 1',
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company.name),
          useValue: mockCompanyModel,
        },
        {
          provide: WorkersService,
          useValue: mockWorkersService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a new company', async () => {
    const company = {
      name: 'Company 1',
      workers: [],
    };

    expect(await service.create(company)).toEqual({
      message: 'Empresa creada correctamente',
      data: {
        id: '507f1f77bcf86cd799439011',
        ...company,
      },
    });

    expect(mockCompanyModel.create).toHaveBeenCalledWith(company);
  });

  it('should find all companies by worker id', async () => {
    const workerId = new Types.ObjectId();

    expect(await service.findAllByWorkerId(workerId)).toEqual({
      data: [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Company 1',
        },
      ],
    });
  });
});
