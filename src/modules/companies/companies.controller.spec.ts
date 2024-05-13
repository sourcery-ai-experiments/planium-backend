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
});
