import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@module/users/users.service';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: Partial<JwtService>;
  let userService: Partial<UsersService>;

  beforeEach(async () => {
    userService = {
      findOne: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: userService,
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

  it('should throw exception if user does not exist', async () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue(null);

    await expect(
      service.signIn('pepe.mock@gmail.com', '12345678'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should thrown exception if password does not match', async () => {
    const mockUser = {
      _id: new Types.ObjectId(),
      email: 'pepe.mock@gmail.com',
      password: '123456789',
    } as any;

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(service, 'comparePasswords').mockResolvedValue(false);

    await expect(
      service.signIn('pepe.mock@gmail.com', '12345678'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return access token if user login', async () => {
    const mockUser = {
      _id: new Types.ObjectId(),
      email: 'pepe.mock@gmail.com',
      password: '123456789',
    } as any;

    const accessToken = 'access-token';

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);
    jest.spyOn(service, 'comparePasswords').mockResolvedValue(true);

    await expect(
      service.signIn('pepe.mock@gmail.com', '123456789'),
    ).resolves.toEqual({
      message: 'Logueado correctamente',
      data: {
        access_token: accessToken,
      },
    });
  });
});
