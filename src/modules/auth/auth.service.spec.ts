import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@module/users/users.service';
import { OtpsService } from '../otps/otps.service';
import { SesService } from '../aws/aws.ses.service';
import { SnsService } from '../aws/aws.sns.service';
import { CompanyUsersService } from '../company_users/company_users.service';
import { WorkersService } from '@/modules/workers/workers.service';
import { Types } from 'mongoose';
import { UserType } from '@/types/User';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: Partial<JwtService>;
  let userService: Partial<UsersService>;
  let otpService: Partial<OtpsService>;
  let sesService: Partial<SesService>;
  let snsService: Partial<SnsService>;
  let companyUserService: Partial<CompanyUsersService>;
  let workerService: Partial<WorkersService>;

  const mockUser = {
    _id: new Types.ObjectId(),
    email: 'pepe.mock@gmail.com',
    password: '123456789',
    companyId: new Types.ObjectId(),
    phone: {
      number: '123456789',
      countryCode: '+57',
    },
  } as any;

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

    workerService = {
      findOne: jest.fn(),
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
        {
          provide: WorkersService,
          useValue: workerService,
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
    const { email, password } = mockUser;

    await expect(service.signIn(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should thrown exception if password does not match', async () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(service, 'comparePasswords').mockResolvedValue(false);

    const { email, password } = mockUser;

    await expect(service.signIn(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return access token if user login', async () => {
    const accessToken = 'access-token';

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(service, 'comparePasswords').mockResolvedValue(true);
    jest.spyOn(service, 'getPayload').mockResolvedValue({ sub: mockUser._id });
    jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

    const { email, password } = mockUser;

    await expect(service.signIn(email, password)).resolves.toEqual({
      message: 'Logueado correctamente',
      data: {
        access_token: accessToken,
      },
    });
  });
  it('should send a recovery sms', async () => {
    const username = 'pepediaz#123';

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(otpService, 'generateOTP').mockResolvedValue('123456');

    await expect(service.sendRecoverySms(username)).resolves.toEqual({
      message: 'SMS enviado correctamente',
      data: {
        userId: mockUser._id,
      },
    });

    expect(snsService.publishSmsToPhone).toHaveBeenCalled();
  });

  it('should send a recovery email', async () => {
    const { _id, email } = mockUser;

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

    jest.spyOn(otpService, 'generateOTP').mockResolvedValue('123456');

    await expect(service.sendRecoveryEmail(email)).resolves.toEqual({
      message: 'Email enviado correctamente',
      data: {
        userId: _id,
      },
    });
  });

  it('should be validate code', async () => {
    const otp = '123456';
    const { _id: userId } = mockUser;

    jest.spyOn(otpService, 'verifyOTP').mockResolvedValue({
      message: 'OTP verificado correctamente',
    });

    await expect(service.verifyRecoveryCode(otp, userId)).resolves.toEqual({
      message: 'OTP verificado correctamente',
    });
  });

  it('should be validate session', async () => {
    const userId = new Types.ObjectId();
    const companyId = new Types.ObjectId();
    const user = {
      _id: userId,
      companyId,
      name: 'Test User',
      toObject: function () {
        return {
          _id: this._id,
          companyId: this.companyId,
          name: this.name,
        };
      },
    } as any;

    jest.spyOn(workerService, 'findOne').mockResolvedValue(user);

    const type = UserType.WORKER;

    const result = await service.validateSession(userId, type, companyId);

    expect(result.message).toBe('Usuario verificado correctamente');
    expect(result.data).toHaveProperty('name', 'Test User');
  });
});
