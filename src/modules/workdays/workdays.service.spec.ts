/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkdaysService } from './workdays.service';
import { WorkersService } from '@module/workers/workers.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Workday } from '@/schemas/Workday';
import { WorkdayType } from '@/types/Workday';

describe('WorkdaysService', () => {
  let service: WorkdaysService;

  const mockWorkersService = {
    findOne: jest.fn().mockImplementation((id: Types.ObjectId) => ({
      id,
      name: 'Daniel Diaz',
    })),
  };

  const mockWorkdayModel = {
    create: jest.fn().mockImplementation((dto) => ({
      dto,
    })),
    find: jest.fn().mockImplementation((where: Record<string, any>) => ({
      where,
    })),
    findOne: jest.fn().mockImplementation((where: Record<string, any>) => ({
      where,
      isActive: true,
    })),
    updateOne: jest
      .fn()
      .mockImplementation(
        (where: Record<string, any>, update: Record<string, any>) => ({
          where,
          update,
        }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkdaysService,
        {
          provide: WorkersService,
          useValue: mockWorkersService,
        },
        {
          provide: getModelToken(Workday.name),
          useValue: mockWorkdayModel,
        },
      ],
    }).compile();

    service = module.get<WorkdaysService>(WorkdaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a workday', async () => {
    const workerId = new Types.ObjectId();
    const companyId = new Types.ObjectId();

    const newWorkday = {
      type: WorkdayType.HOURS,
      fileId: new Types.ObjectId(),
      projectId: new Types.ObjectId(),
    };

    expect(await service.create(newWorkday, workerId, companyId)).toEqual({
      message: 'Jornada creada correctamente',
    });

    expect(mockWorkdayModel.create).toHaveBeenCalledWith({
      workerId,
      companyId,
      updatedBy: workerId,
      ...newWorkday,
    });
  });

  it('should end a workday', async () => {
    const workdayId = new Types.ObjectId();
    const companyId = new Types.ObjectId();

    expect(await service.endWorkday(workdayId, companyId)).toEqual({
      message: 'Jornada finalizada correctamente',
    });
  });
});
