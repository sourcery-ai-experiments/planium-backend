/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesController;

  const roleList = [
    {
      _id: '65b91a6499763086e5900fd3',
      name: 'Supervisor',
    },
    {
      _id: '65b9229f6dfdca478c623769',
      name: 'Contratista',
    },
  ];

  const mockRolesService = {
    create: jest.fn().mockImplementation((dto) => ({
      message: 'Rol creado correctamente',
    })),
    findAll: jest.fn().mockImplementation(() => ({
      roleList,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    })
      .overrideProvider(RolesService)
      .useValue(mockRolesService)
      .compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a new role', async () => {
    const roleDto = {
      name: 'Supervisor',
    };

    expect(await controller.create(roleDto)).toEqual({
      message: 'Rol creado correctamente',
    });

    expect(mockRolesService.create).toHaveBeenCalled();
  });

  it('should be find all roles', async () => {
    expect(await controller.findAll()).toEqual({
      roleList,
    });

    expect(mockRolesService.findAll).toHaveBeenCalled();
  });
});
