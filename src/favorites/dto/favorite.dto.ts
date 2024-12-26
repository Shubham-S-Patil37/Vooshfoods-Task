import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class FavoriteDTO {
  @IsString()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  category: string;

}
