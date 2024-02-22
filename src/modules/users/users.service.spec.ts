/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '@/schemas/User';
import { getModelToken } from '@nestjs/mongoose';
import { UserType } from '@/types/User';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const dto = {
    name: 'Pepe Díaz',
    username: 'pepe.mock',
    email: 'pepe@gmail.com',
    password: '12345678',
    type: UserType.WORKER,
    companyId: new Types.ObjectId(),
  };

  const userList = [
    {
      id: new Types.ObjectId(),
      name: 'Daniel Diaz',
      username: 'daniel.mock',
      email: 'daniel.mock@gmail.com',
      companyId: new Types.ObjectId(),
    },
    {
      id: new Types.ObjectId(),
      name: 'Juan Diaz',
      username: 'juan.mock',
      email: 'juan.mock@gmail.com',
      companyId: new Types.ObjectId(),
    },
  ];

  const mockUserModel = {
    create: jest.fn().mockImplementation((dto) => [
      {
        toObject: () => ({ ...dto, id: '507f1f77bcf86cd799439011' }),
      },
    ]),
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

  it('should create a new user', async () => {
    jest.spyOn(service, 'validateUserExists').mockImplementation(() => null);

    expect(await service.create(dto)).toEqual({
      message: 'Usuario creado correctamente',
      data: expect.any(Object),
    });
  });

  it('should return a user by email', async () => {
    const email = 'daniel.mock@gmail.com';

    expect(await service.findOne({ email })).toEqual(userList[0]);
  });

  it('should throw an error when email/username exists', async () => {
    jest.spyOn(service, 'validateUserExists').mockImplementation(() => {
      throw new BadRequestException(
        'El email o el username ya están en uso dentro de la empresa',
      );
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  /*  it('should update a user', async () => {
    const userId = new Types.ObjectId('507f1f77bcf86cd799439011');
    const updateDto = {
      name: 'Pepe Díaz',
      username: 'pepe.mock',
      email: 'pepe@gmail.com',
      password: '12345678',
      type: UserType.WORKER,
      companyId: new Types.ObjectId(),
    };

    const { password, ...userData } = updateDto;

    expect(await service.update(userId, updateDto)).toEqual({
      message: 'Usuario actualizado correctamente',
      data: {
        id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        ...userData,
      },
    });
  }); */
});
