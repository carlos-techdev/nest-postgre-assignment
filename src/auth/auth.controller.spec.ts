import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        it('should return the result of authService.register', async () => {
            const dto: AuthDto = { email: 'test@example.com', password: 'password123' };
            const result = {
                msg: 'user created',
                data: { id: 1, email: 'test@example.com', password: 'ddd', created_at: new Date(), updated_at: new Date() }
            };
            jest.spyOn(authService, 'register').mockResolvedValue(result);

            expect(await controller.register(dto)).toEqual(result);
            expect(authService.register).toHaveBeenCalledWith(dto);
        });
    });

    describe('login', () => {
        it('should return the result of authService.login', async () => {
            const dto: AuthDto = { email: 'test@example.com', password: 'password123' };
            const result = { access_token: 'some_token_string' };
            jest.spyOn(authService, 'login').mockResolvedValue(result);

            expect(await controller.login(dto)).toEqual(result);
            expect(authService.login).toHaveBeenCalledWith(dto);
        });
    });
});
