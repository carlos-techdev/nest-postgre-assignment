import { IsInt, IsString } from 'class-validator';

export class CatDto {

  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;

}
