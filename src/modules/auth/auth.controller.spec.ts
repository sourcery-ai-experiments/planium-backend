/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signInWorker: jest.fn().mockImplementation((email, password) => ({
      message: 'Logueado correctamente',
      data: {
        access_token: 'token',
      },
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign in a worker', async () => {
    const workerDto = {
      email: 'kuzo.mock@gmail.com',
      password: '12345678',
    };
    expect(await controller.signInWorker(workerDto)).toEqual({
      message: 'Logueado correctamente',
      data: {
        access_token: 'token',
      },
    });

    expect(mockAuthService.signInWorker).toHaveBeenCalled();
  });
});
