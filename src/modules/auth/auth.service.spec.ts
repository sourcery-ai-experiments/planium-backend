import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { WorkersService } from '@module/workers/workers.service';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: Partial<JwtService>;
  let workerService: Partial<WorkersService>;

  beforeEach(async () => {
    workerService = {
      findOne: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: WorkersService,
          useValue: workerService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw exception if worker does not exist', async () => {
    jest.spyOn(workerService, 'findOne').mockResolvedValue(null);

    await expect(
      service.signInWorker('pepe.mock@gmail.com', '12345678'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should thrown exception if password does not match', async () => {
    const mockWorker = {
      _id: new Types.ObjectId(),
      email: 'pepe.mock@gmail.com',
      password: '123456789',
    } as any;

    jest.spyOn(workerService, 'findOne').mockResolvedValue(mockWorker);
    jest.spyOn(service, 'comparePasswords').mockResolvedValue(false);

    await expect(
      service.signInWorker('pepe.mock@gmail.com', '12345678'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return access token', async () => {
    const mockWorker = {
      _id: new Types.ObjectId(),
      email: 'pepe.mock@gmail.com',
      password: '123456789',
    } as any;

    const accessToken = 'access-token';

    jest.spyOn(workerService, 'findOne').mockResolvedValue(mockWorker);
    jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);
    jest.spyOn(service, 'comparePasswords').mockResolvedValue(true);

    await expect(
      service.signInWorker('pepe.mock@gmail.com', '123456789'),
    ).resolves.toEqual({
      message: 'Logueado correctamente',
      data: {
        access_token: accessToken,
      },
    });
  });
});
