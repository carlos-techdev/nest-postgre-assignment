import { Body, Controller, Get, Param, Post, Delete, Patch, UseGuards } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatDto } from './dto/cat.dto';
import { JwtGuard } from '../auth/guard';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) { }

  //Add Cat
  @UseGuards(JwtGuard)
  @Post('add')
  async addCat(@Body() CatDto: CatDto) {
    return this.catsService.addCat(CatDto);
  }

  //Delete Cat
  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  async deleteCatById(@Param('id') id: string) {
    return this.catsService.deleteCatById(parseInt(id));
  }

  //Get Cats
  @UseGuards(JwtGuard)
  @Get()
  async getCats() {
    return this.catsService.getCats();
  }

  //Get Cat By Id
  @UseGuards(JwtGuard)
  @Get('/:id')
  getCatById(@Param('id') id: string) {
    return this.catsService.getCatById(parseInt(id));
  }

  //Update Cat By Id
  @UseGuards(JwtGuard)
  @Patch('update/:id')
  updateCat(@Param('id') id: string, @Body() dto: CatDto) {
    return this.catsService.updateCat(parseInt(id), dto);
  }
}
