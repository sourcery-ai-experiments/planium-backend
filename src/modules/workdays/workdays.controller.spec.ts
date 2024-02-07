import { Test, TestingModule } from '@nestjs/testing';
import { WorkdaysController } from './workdays.controller';

describe('WorkdaysController', () => {
  let controller: WorkdaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkdaysController],
    }).compile();

    controller = module.get<WorkdaysController>(WorkdaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
