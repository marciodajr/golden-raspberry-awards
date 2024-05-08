import { Movie as MoviesPrisma } from '@prisma/client';

export class Movie implements MoviesPrisma {
  id: number;
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string;
}
