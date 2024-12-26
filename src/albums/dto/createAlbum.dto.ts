import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class CreateAlbumDTO {
  @IsString()
  @IsNotEmpty()
  artistId: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  genre: string;

  @IsNumber()
  @IsNotEmpty()
  releaseAt: number; // release year

}
