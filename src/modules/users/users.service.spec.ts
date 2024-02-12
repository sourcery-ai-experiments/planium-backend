/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '@/schemas/User';
import { getModelToken } from '@nestjs/mongoose';
import { UserType } from '@/types/User';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;

  const userList = [
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

  const mockUserModel = {
    create: jest.fn().mockImplementation((dto) => ({
      toObject: () => ({ ...dto, id: '507f1f77bcf86cd799439011' }),
    })),
    findByIdAndUpdate: jest.fn().mockImplementation((id, dto) => ({
      exec: jest.fn().mockResolvedValue({
        id,
        ...dto,
      }),
      toObject: () => ({ id, ...dto }),
    })),
    findOne: jest.fn().mockImplementation((where) => ({
      exec: jest.fn().mockResolvedValue(userList[0]),
    })),
    findById: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue(userList[0]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = {
      name: 'Pepe Díaz',
      email: 'pepe@gmail.com',
      password: '12345678',
      nationality: 'Colombiana',
      phone: {
        number: '3003421965',
        countryCode: '57',
      },
      type: UserType.WORKER,
    };

    jest.spyOn(service, 'verifyEmailExists').mockImplementation(() => null);

    jest.spyOn(service, 'findOne').mockImplementation(() => null);

    const { password, ...userData } = dto;

    expect(await service.create(dto)).toEqual({
      message: 'Usuario creado correctamente',
      data: {
        id: '507f1f77bcf86cd799439011',
        ...userData,
      },
    });
  });

  it('should return a user by email', async () => {
    const email = 'daniel.mock@gmail.com';

    expect(await service.findOne({ email })).toEqual(userList[0]);
  });

  it('should update a user', async () => {
    const userId = new Types.ObjectId('507f1f77bcf86cd799439011');
    const updateDto = {
      name: 'Pepe Díaz',
      email: 'pepe@gmail.com',
      password: '12345678',
      nationality: 'Colombiana',
      phone: {
        number: '3003421965',
        countryCode: '57',
      },
    };

    const { password, ...userData } = updateDto;

    expect(await service.update(userId, updateDto)).toEqual({
      message: 'Usuario actualizado correctamente',
      data: {
        id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        ...userData,
      },
    });
  });
});
