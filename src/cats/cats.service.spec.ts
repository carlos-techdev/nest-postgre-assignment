import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cat } from './cat.entity';
import { Repository } from 'typeorm';
import { CatInterface } from './interfaces/cat.interface';

describe('CatsService', () => {
    let service: CatsService;
    let mockRepository: MockType<Repository<Cat>>;

    // Mock repository factory
    const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
    }));

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CatsService,
                {
                    provide: getRepositoryToken(Cat),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<CatsService>(CatsService);
        mockRepository = module.get(getRepositoryToken(Cat));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Tests go here
    describe('addCat', () => {
        it('should successfully add a cat', async () => {
            const catDto = { name: 'Whiskers', age: 3, breed: 'Siamese' };
            const savedCat: CatInterface = { ...catDto, id: 1, created_at: new Date(), updated_at: new Date() };
            mockRepository.create.mockReturnValue(savedCat as any);
            mockRepository.save.mockResolvedValue(savedCat as never);

            const result = await service.addCat(catDto);
            expect(mockRepository.create).toHaveBeenCalledWith(catDto);
            expect(mockRepository.save).toHaveBeenCalledWith(savedCat);
            expect(result).toEqual({ msg: 'Cat Saved', data: savedCat });
        });
    });

    describe('deleteCatById', () => {
        it('should delete a cat successfully', async () => {
            const catId = 1;
            mockRepository.findOne.mockResolvedValue({ id: catId, name: 'Whiskers', age: 5, breed: 'Tabby' } as never);
            mockRepository.delete.mockResolvedValue(undefined as never);

            const result = await service.deleteCatById(catId);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: catId } });
            expect(mockRepository.delete).toHaveBeenCalledWith(catId);
            expect(result).toEqual({ msg: 'Cat Deleted' });
        });

        it('should return a not found message when cat does not exist', async () => {
            const catId = 999;
            mockRepository.findOne.mockResolvedValue(undefined as never);

            const result = await service.deleteCatById(catId);
            expect(result).toEqual({ msg: 'Cat Not Found' });
        });
    });

    describe('getCats', () => {
        it('should return an array of cats', async () => {
            const mockCats = [
                { id: 1, name: 'Whiskers', age: 3, breed: 'Siamese', created_at: new Date(), updated_at: new Date() },
                { id: 2, name: 'Shadow', age: 4, breed: 'Maine Coon', created_at: new Date(), updated_at: new Date() }
            ];
            mockRepository.find.mockResolvedValue(mockCats as never);

            const result = await service.getCats();
            expect(result).toEqual(mockCats);
            expect(mockRepository.find).toHaveBeenCalled();
        });

        it('should return an empty array if no cats are found', async () => {
            mockRepository.find.mockResolvedValue([] as never);
            const result = await service.getCats();
            expect(result).toEqual([]);
        });
    });

    describe('getCatById', () => {
        it('should return a cat if found', async () => {
            const mockCat = { id: 1, name: 'Whiskers', age: 3, breed: 'Siamese', created_at: new Date(), updated_at: new Date() };
            mockRepository.findOne.mockResolvedValue(mockCat as never);

            const result = await service.getCatById(1);
            expect(result).toEqual({ msg: 'Cats Found', data: mockCat });
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should return a not found message if no cat is found', async () => {
            mockRepository.findOne.mockResolvedValue(undefined as never);
            const result = await service.getCatById(999);
            expect(result).toEqual({ msg: 'Cat Not Found' });
        });
    });

    describe('updateCat', () => {
        it('should update a cat successfully', async () => {
            const catDto = { name: 'Whiskers Updated', age: 5, breed: 'Siamese' };
            const existingCat = { id: 1, name: 'Whiskers', age: 3, breed: 'Siamese', created_at: new Date(), updated_at: new Date() };

            mockRepository.findOne.mockResolvedValue(existingCat as never);
            mockRepository.update.mockResolvedValue(undefined as never); // update usually does not return value

            const result = await service.updateCat(1, catDto);
            expect(result).toEqual({ msg: 'Cat Updated' });
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRepository.update).toHaveBeenCalledWith(1, catDto);
        });

        it('should return a not found message if no cat exists to update', async () => {
            mockRepository.findOne.mockResolvedValue(undefined as never);

            const result = await service.updateCat(999, { name: 'Ghost', age: 9, breed: 'Ghost Breed' });
            expect(result).toEqual({ msg: 'Cat Not Found' });
        });
    });



});

// Helper type for mocking repository functions
type MockType<T> = {
    [P in keyof T]?: jest.Mock<object>;
};
