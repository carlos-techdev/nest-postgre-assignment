import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { JwtGuard } from '../auth/guard';
import { User } from './user.entity';
import { Reflector } from '@nestjs/core';

describe('UserController', () => {
  let controller: UserController;
  let testUser: User;

  beforeEach(async () => {
    testUser = {
      id: 1,
      email: 'test@example.com',
      password: 'secret', // Although this won't be used directly or returned
      created_at: new Date(),
      updated_at: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: Reflector,
          useValue: {},
        },
        {
          provide: 'JwtGuard',
          useValue: { canActivate: jest.fn(() => true) },
        },
      ],
    }).overrideGuard(JwtGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return the user object', async () => {
      const result = await controller.getMe(testUser);
      expect(result).toEqual(testUser);
    });
  });
});
