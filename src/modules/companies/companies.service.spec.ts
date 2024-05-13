import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompaniesService } from './companies.service';
import { Company } from '@schema/Company';
import { WorkersService } from '@/modules/workers/workers.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

  const mockWorkersService = {
    findById: jest.fn().mockImplementation((workerId) => [
      {
        _id: workerId,
        name: 'Worker 1',
      },
    ]),
  };

  const mockCompanyModel = {
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
    })),
    aggregate: jest.fn().mockImplementation(() => [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'Company 1',
      },
    ]),
    findOne: jest.fn().mockImplementation((where) => ({
      _id: '507f1f77bcf86cd799439011',
      ...where,
    })),
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
    };

    jest.spyOn(mockCompanyModel, 'findOne').mockImplementation(() => null);

    expect(await service.create(company)).toEqual({
      message: 'Empresa creada correctamente',
      data: {
        publicId: expect.any(String),
        ...company,
      },
    });

    expect(mockCompanyModel.create).toHaveBeenCalled();
  });
});
