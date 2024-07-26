import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatDto } from './dto/cat.dto';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            addCat: jest.fn(),
            deleteCatById: jest.fn(),
            getCats: jest.fn(),
            getCatById: jest.fn(),
            updateCat: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addCat', () => {
    it('should add a cat', async () => {
      const catDto: CatDto = {
        name: 'Pixel',
        age: 2,
        breed: 'Bombay',
      };
      const expectedResult = {
        msg: 'Cat Saved',
        data: {
          ...catDto,
          id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
      };
      jest.spyOn(service, 'addCat').mockResolvedValue(expectedResult);

      expect(await controller.addCat(catDto)).toEqual(expectedResult);
    });
  });

  describe('deleteCatById', () => {
    it('should delete a cat by id', async () => {
      const id = 1;
      const expectedResult = {
        msg: 'Cat Deleted',
      };
      jest.spyOn(service, 'deleteCatById').mockResolvedValue(expectedResult);

      expect(await controller.deleteCatById(id.toString())).toEqual(expectedResult);
    });
  });

  describe('getCats', () => {
    it('should return an array of cats', async () => {
      const cats = [
        {
          id: 1,
          name: 'Pixel',
          age: 2,
          breed: 'Bombay',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      jest.spyOn(service, 'getCats').mockResolvedValue(cats);

      expect(await controller.getCats()).toEqual(cats);
    });
  });

  describe('getCatById', () => {
    it('should return a cat by id', async () => {
      const id = 1;
      const cat = {
        msg: 'Cats Found',
        data: {
          id: 1,
          name: 'Pixel',
          age: 2,
          breed: 'Bombay',
          created_at: new Date(),
          updated_at: new Date(),
        }
      }
      jest.spyOn(service, 'getCatById').mockResolvedValue(cat);

      expect(await controller.getCatById(id.toString())).toEqual(cat);
    });
  });

  describe('updateCat', () => {
    it('should update a cat by id', async () => {
      const id = 1;
      const catDto: CatDto = {
        name: 'Pixel',
        age: 2,
        breed: 'Bombay',
      };
      const expectedResult = {
        msg: 'Cat Updated',
      };
      
      jest.spyOn(service, 'updateCat').mockResolvedValue(expectedResult);

      expect(await controller.updateCat(id.toString(), catDto)).toEqual(expectedResult);
    });
  });
});
