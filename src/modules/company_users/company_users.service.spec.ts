import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompanyUsersService } from './company_users.service';
import { UsersService } from '@/modules/users/users.service';
import { CompaniesService } from '@/modules/companies/companies.service';
import { CompanyUser } from '@/schemas/CompanyUser';

describe('CompanyUsersService', () => {
  let service: CompanyUsersService;

  const mockUserService = {
    create: jest.fn().mockImplementation((dto) => ({
      message: 'Usuario creado correctamente',
      data: {
        _id: '507f1f77bcf86cd799439011',
        ...dto,
      },
    })),
  };

  const mockCompanyService = {
    create: jest.fn().mockImplementation((dto) => ({
      message: 'Empresa creada correctamente',
      data: {
        _id: '507f1f77bcf86cd799439011',
        ...dto,
      },
    })),
  };

  const mockCompanyUserModel = {
    create: jest.fn().mockImplementation((dto) => ({
      toObject: () => ({ ...dto, id: '507f1f77bcf86cd799439011' }),
    })),
    findOne: jest.fn().mockImplementation((where) => ({
      exec: jest
        .fn()
        .mockResolvedValue({ ...where, id: '507f1f77bcf86cd799439011' }),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyUsersService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: CompaniesService,
          useValue: mockCompanyService,
        },
        {
          provide: getModelToken(CompanyUser.name),
          useValue: mockCompanyUserModel,
        },
      ],
    }).compile();

    service = module.get<CompanyUsersService>(CompanyUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a company user', async () => {
    const dto = {
      name: 'Daniel Perez',
      email: 'company2@gmail.com',
      password: '12345678',
      countryId: 'Colombiana',
      phone: {
        number: '3209561247',
        countryCode: '57',
      },
      companyName: 'Empresa 2',
      roleId: '65b91a6499763086e5900fd3',
    };

    expect(await service.create(dto)).toEqual({
      message: 'Usuario creado correctamente',
    });

    expect(mockUserService.create).toHaveBeenCalled();

    expect(mockCompanyService.create).toHaveBeenCalled();

    expect(mockCompanyUserModel.create).toHaveBeenCalled();
  });
});
