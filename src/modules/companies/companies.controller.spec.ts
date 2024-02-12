/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Types } from 'mongoose';

describe('CompaniesController', () => {
  let controller: CompaniesController;

  const companyList = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Empresa 1',
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Empresa 2',
    },
  ];

  const mockCompaniesService = {
    findAllByWorkerId: jest.fn().mockImplementation((workerId) => {
      return companyList;
    }),
    addWorker: jest.fn().mockImplementation((companyId, worker) => {
      return { message: 'Operario agregado correctamente' };
    }),
    removeWorker: jest.fn().mockImplementation((companyId, workerId) => {
      return { message: 'Operario eliminado correctamente' };
    }),
    updateWorker: jest.fn().mockImplementation((companyId, worker) => {
      return { message: 'Operario actualizado correctamente' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [CompaniesService],
    })
      .overrideProvider(CompaniesService)
      .useValue(mockCompaniesService)
      .compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all companies by worker id', async () => {
    const workerId = new Types.ObjectId();

    expect(await controller.findAllByWorkerId(workerId)).toEqual(companyList);

    expect(mockCompaniesService.findAllByWorkerId).toHaveBeenCalled();
  });

  it('should add a worker', async () => {
    const companyId = new Types.ObjectId('507f1f77bcf86cd799439011');
    const worker = {
      salary: '12',
      workerId: new Types.ObjectId(),
    };

    expect(await controller.addWorker(worker, companyId)).toEqual({
      message: 'Operario agregado correctamente',
    });

    expect(mockCompaniesService.addWorker).toHaveBeenCalled();
  });

  it('should remove a worker', async () => {
    const companyId = new Types.ObjectId('507f1f77bcf86cd799439011');
    const worker = {
      salary: '12',
      workerId: new Types.ObjectId(),
    };

    expect(await controller.removeWorker(worker, companyId)).toEqual({
      message: 'Operario eliminado correctamente',
    });

    expect(mockCompaniesService.removeWorker).toHaveBeenCalled();
  });

  it('should update a worker', async () => {
    const companyId = new Types.ObjectId('507f1f77bcf86cd799439011');
    const worker = {
      salary: '12',
      workerId: new Types.ObjectId(),
    };

    expect(await controller.updateWorker(worker, companyId)).toEqual({
      message: 'Operario actualizado correctamente',
    });

    expect(mockCompaniesService.updateWorker).toHaveBeenCalled();
  });
});
