import { Test, TestingModule } from '@nestjs/testing';
import { WorkersService } from './workers.service';
import { Worker } from '@/schemas/Worker';

describe('WorkersService', () => {
  let service: WorkersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkersService,
        {
          provide: 'WorkerModel',
          useValue: Worker,
        },
      ],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
