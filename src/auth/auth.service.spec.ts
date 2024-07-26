import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'create').mockReturnValueOnce(mockUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser as any);

      const result = await service.register(mockUser);

      expect(result).toEqual({
        msg: 'user created',
        data: mockUser,
      });
    });

    it('should throw an error if user with the email already exists', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser as any);

      await expect(service.register(mockUser)).rejects.toThrow('User with the email already exist');
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser as any);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(true);

      const result = await service.login(mockUser);

      expect(result).toHaveProperty('access_token');
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const mockUser = { email: 'test@example.com', password: 'password123' };
      
      await expect(service.login(mockUser)).rejects.toThrow('User Does Not Exist');
    });

    it('should throw an error if credentials are invalid', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser as any);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(false);

      await expect(service.login(mockUser)).rejects.toThrow('Invalid Credentials');
    });
  });
});
