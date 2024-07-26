import { Injectable } from '@nestjs/common';
import { CatDto } from './dto/cat.dto';
import { Cat } from './cat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CatsService {
  constructor(@InjectRepository(Cat) private repo: Repository<Cat>) { }

  async addCat(dto: CatDto) {
    const cat = await this.repo.create(dto);
    await this.repo.save(cat);
    return {
      msg: 'Cat Saved',
      data: cat,
    };
  }

  async deleteCatById(id: number) {
    const cat = await this.repo.findOne({ where: { id: id } });
    if (!cat) {
      return {
        msg: 'Cat Not Found',
      };
    }
    await this.repo.delete(id);
    return {
      msg: 'Cat Deleted',
    };
  }

  async getCats() {
    const cats = await this.repo.find();
    return cats;
  }

  async getCatById(id: number) {
    const cat = await this.repo.findOne({ where: { id: id } });
    if (!cat) {
      return {
        msg: 'Cat Not Found',
      };
    }
    return {
      msg: 'Cats Found',
      data: cat,
    };
  }
  async updateCat(id: number, dto: CatDto) {
    const cat = await this.repo.findOne({ where: { id: id } });
    if (!cat) {
      return {
        msg: 'Cat Not Found',
      };
    }
    await this.repo.update(id, dto);
    return {
      msg: 'Cat Updated',
    };
  }
}
