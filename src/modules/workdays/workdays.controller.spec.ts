/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkdaysController } from './workdays.controller';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { Types } from 'mongoose';
import { WorkdayType } from '@/types/Workday';

describe('WorkdaysController', () => {
  let controller: WorkdaysController;
  const mockWorkdaysService = {
    create: jest.fn(
      (
        dto: CreateWorkdayDto,
        workerId: Types.ObjectId,
        companyId: Types.ObjectId,
      ) => {
        return {
          message: 'Jornada creada correctamente',
        };
      },
    ),
    endWorkday: jest.fn(
      (workerId: Types.ObjectId, companyId: Types.ObjectId) => {
        return {
          message: 'La jornada ya ha sido finalizada',
        };
      },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkdaysController],
      providers: [WorkdaysService],
    })
      .overrideProvider(WorkdaysService)
      .useValue(mockWorkdaysService)
      .compile();

    controller = module.get<WorkdaysController>(WorkdaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a workday', async () => {
    const dto = {
      type: WorkdayType.HOURS,
      projectId: new Types.ObjectId(),
    };
    const workerId = '507f1f77bcf86cd799439011';
    const companyId = new Types.ObjectId('507f1f77bcf86cd799439011');

    const file = {
      originalname: 'test.jpg',
      buffer: Buffer.from('test'),
    } as any;

    expect(
      await controller.create(
        dto,
        { user: { sub: workerId } },
        file,
        companyId,
      ),
    ).toEqual({
      message: 'Jornada creada correctamente',
    });

    expect(mockWorkdaysService.create).toHaveBeenCalled();
  });

  it('should end a workday', async () => {
    const workerId = new Types.ObjectId();
    const companyId = new Types.ObjectId('507f1f77bcf86cd799439011');

    expect(await controller.endWorkday(workerId, companyId)).toEqual({
      message: 'La jornada ya ha sido finalizada',
    });

    expect(mockWorkdaysService.endWorkday).toHaveBeenCalled();
  });
});
