import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@module/users/users.service';
import { OtpsService } from '../otps/otps.service';
import { SesService } from '../aws/aws.ses.service';
import { SnsService } from '../aws/aws.sns.service';
import { CompanyUsersService } from '../company_users/company_users.service';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: Partial<JwtService>;
  let userService: Partial<UsersService>;
  let otpService: Partial<OtpsService>;
  let sesService: Partial<SesService>;
  let snsService: Partial<SnsService>;
  let companyUserService: Partial<CompanyUsersService>;

  beforeEach(async () => {
    userService = {
      findOne: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    otpService = {
      generateOTP: jest.fn(),
      verifyOTP: jest.fn(),
    };

    sesService = {
      sendEmail: jest.fn(),
    };

    snsService = {
      publishSmsToPhone: jest.fn(),
    };

    companyUserService = {
      findByUserId: jest.fn(),
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
        {
          provide: OtpsService,
          useValue: otpService,
        },
        {
          provide: SesService,
          useValue: sesService,
        },
        {
          provide: SnsService,
          useValue: snsService,
        },
        {
          provide: CompanyUsersService,
          useValue: companyUserService,
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
  it('should send a recovery sms', async () => {
    const phone = '12345678';
    const countryCode = '54';
    const id = new Types.ObjectId();

    const mockUser = {
      _id: id,
    } as any;

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(otpService, 'generateOTP').mockResolvedValue('123456');

    await expect(service.sendRecoverySms(phone, countryCode)).resolves.toEqual({
      message: 'SMS enviado correctamente',
      data: {
        userId: id,
      },
    });

    expect(snsService.publishSmsToPhone).toHaveBeenCalled();
  });

  it('should send a recovery email', async () => {
    const email = 'mock.test@gmail.com';
    const id = new Types.ObjectId();

    jest.spyOn(userService, 'findOne').mockResolvedValue({
      _id: id,
      email,
    } as any);

    jest.spyOn(otpService, 'generateOTP').mockResolvedValue('123456');

    await expect(service.sendRecoveryEmail(email)).resolves.toEqual({
      message: 'Email enviado correctamente',
      data: {
        userId: id,
      },
    });
  });

  it('should be validate code', async () => {
    const otp = '123456';
    const userId = '65addbe51328a245e6fd67df';

    jest.spyOn(otpService, 'verifyOTP').mockResolvedValue({
      message: 'OTP verificado correctamente',
    });

    await expect(service.verifyRecoveryCode(otp, userId)).resolves.toEqual({
      message: 'OTP verificado correctamente',
    });
  });
});
