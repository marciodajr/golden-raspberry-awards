import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../entities/movie.entity';
import { OmitType } from '@nestjs/mapped-types';

export class MovieDto extends OmitType(Movie, ['id'] as const) {
  @ApiProperty()
  year: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  studios: string;

  @ApiProperty()
  producers: string;

  @ApiProperty()
  winner: string;
}
