import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class TrackDTO {
  @IsString()
  @IsNotEmpty()
  albumId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number; // Duration in minutes
}
