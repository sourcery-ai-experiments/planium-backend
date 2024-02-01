import { Test, TestingModule } from '@nestjs/testing';
import { CompanyUsersController } from './company_users.controller';
import { CompanyUsersService } from './company_users.service';

describe('CompanyUsersController', () => {
  let controller: CompanyUsersController;

  const mockCompanyUsersService = {
    create: jest.fn().mockImplementation((dto) => ({
      message: 'Usuario creado correctamente',
      data: {
        _id: '507f1f77bcf86cd799439011',
        ...dto,
      },
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyUsersController],
      providers: [CompanyUsersService],
    })
      .overrideProvider(CompanyUsersService)
      .useValue(mockCompanyUsersService)
      .compile();

    controller = module.get<CompanyUsersController>(CompanyUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a company user', async () => {
    const dto = {
      name: 'Daniel Perez',
      email: 'company2@gmail.com',
      password: '12345678',
      nationality: 'Colombiana',
      phone: {
        number: '3209561247',
        countryCode: '57',
      },
      companyName: 'Empresa 2',
      roleId: '65b91a6499763086e5900fd3',
    };

    expect(await controller.create(dto)).toEqual({
      message: 'Usuario creado correctamente',
      data: {
        _id: '507f1f77bcf86cd799439011',
        ...dto,
      },
    });

    expect(mockCompanyUsersService.create).toHaveBeenCalled();
  });
});
