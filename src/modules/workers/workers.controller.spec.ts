/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { Types } from 'mongoose';

describe('WorkersController', () => {
  let controller: WorkersController;
  const mockWorkerService = {
    create: jest.fn((dto: CreateWorkerDto) => {
      return {
        message: 'Operario creado correctamente',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [WorkersService],
    })
      .overrideProvider(WorkersService)
      .useValue(mockWorkerService)
      .compile();

    controller = module.get<WorkersController>(WorkersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a worker', async () => {
    const dto = {
      name: 'Pepe Díaz',
      username: 'pepe.diaz',
      email: 'pepe@gmail.com',
      password: '12345678',
      countryId: 'Colombiana',
      fileId: new Types.ObjectId('507f1f77bcf86cd799439011'),
      projectId: new Types.ObjectId(),
    };

    const companyId = new Types.ObjectId();

    expect(await controller.create(dto, companyId)).toEqual({
      message: 'Operario creado correctamente',
    });

    expect(mockWorkerService.create).toHaveBeenCalled();
  });
});
