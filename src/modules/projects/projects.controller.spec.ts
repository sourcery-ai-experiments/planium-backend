/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Types } from 'mongoose';

describe('ProjectsController', () => {
  let controller: ProjectsController;

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

  const mockProjectsService = {
    create: jest.fn().mockImplementation((createProjectDto, companyId) => ({
      message: 'Proyecto creado correctamente',
    })),
    getByWorkerId: jest
      .fn()
      .mockImplementation((workerId, companyId) => projectList),
    addWorkers: jest
      .fn()
      .mockImplementation((projectId, workers, companyId) => ({
        message: 'Operario(s) agregado(s) correctamente',
      })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [ProjectsService],
    })
      .overrideProvider(ProjectsService)
      .useValue(mockProjectsService)
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a project', async () => {
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
    const companyId = new Types.ObjectId();

    expect(await controller.create(createProjectDto, companyId)).toEqual({
      message: 'Proyecto creado correctamente',
    });

    expect(mockProjectsService.create).toHaveBeenCalled();
  });

  it('should get projects by worker id', async () => {
    const workerId = new Types.ObjectId();
    const companyId = new Types.ObjectId();

    expect(await controller.getByWorkerId(workerId, companyId)).toEqual(
      projectList,
    );

    expect(mockProjectsService.getByWorkerId).toHaveBeenCalled();
  });

  it('should add workers to a project', async () => {
    const projectId = new Types.ObjectId();
    const workers = ['60f6d3b3d9f3f3c8f3b9b1d3', '60f6d3b3d9f3f3c8f3b9b1d4'];
    const companyId = new Types.ObjectId();

    expect(
      await controller.addWorkers({ workers }, projectId, companyId),
    ).toEqual({
      message: 'Operario(s) agregado(s) correctamente',
    });
  });
});
