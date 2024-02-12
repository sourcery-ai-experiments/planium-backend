/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Worker } from '@/schemas/Worker';
import { UsersService } from '@module/users/users.service';
import { WorkersService } from './workers.service';
import { Types } from 'mongoose';

describe('WorkersService', () => {
  let service: WorkersService;

  const mockUserService = {
    create: jest.fn().mockImplementation((dto) => ({
      message: 'Usuario creado correctamente',
      data: {
        _id: '507f1f77bcf86cd799439011',
        ...dto,
      },
    })),
  };

  const workerList = [
    {
      id: '507f1f77bcf86cd799439011',
      name: 'Daniel Diaz',
      email: 'daniel.mock@gmail.com',
    },
    {
      id: '507f1f77bcf86cd799439012',
      name: 'Juan Diaz',
      email: 'juan.mock@gmail.com',
    },
  ];

  const mockWorkerModel = {
    create: jest.fn().mockImplementation((dto) => ({
      toObject: () => ({ ...dto, id: '507f1f77bcf86cd799439011' }),
    })),
    find: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(workerList),
    })),
    findById: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue(workerList[0]),
    })),
    findOne: jest.fn().mockImplementation((where) => ({
      exec: jest.fn().mockResolvedValue(workerList[0]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkersService,
        {
          provide: getModelToken(Worker.name),
          useValue: mockWorkerModel,
        },
        UsersService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a worker', async () => {
    const dto = {
      name: 'Pepe Díaz',
      email: 'pepe@gmail.com',
      password: '12345678',
      nationality: 'Colombiana',
      phone: {
        number: '3003421965',
        countryCode: '57',
      },
      personalInformation: {
        socialSecurityNumber: '123456789',
        fileId: new Types.ObjectId('507f1f77bcf86cd799439011'),
      },
      emergencyContact: {
        name: 'Juan Diaz',
        phone: '3003421965',
        phoneCountryCode: '57',
      },
    };

    expect(await service.create(dto)).toEqual({
      message: 'Operario creado correctamente',
    });
  });

  it('should return all workers', async () => {
    expect(await service.findAll()).toEqual(workerList);
  });

  it('should return a worker by id', async () => {
    expect(await service.findById('507f1f77bcf86cd799439011')).toEqual(
      workerList[0],
    );
  });

  it('should return a worker by email', async () => {
    expect(await service.findOne({ email: 'daniel.mock@gmail.com' })).toEqual(
      workerList[0],
    );
  });
});
