import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MovieDto } from './dto/movie.dto';

type IProducer = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaClient) {}

  async getProducerWithMaxMinIntervals() {
    const data = await this.prisma.movie.findMany({
      where: {
        winner: 'yes',
      },
      orderBy: {
        year: 'asc',
      },
      select: {
        year: true,
        producers: true,
      },
    });

    const movies: Pick<MovieDto, 'year' | 'producers'>[] = [];

    data.forEach((movie) => {
      const producers = movie.producers.split(/,| and /);
      const year = movie.year;
      producers.forEach((producer) => {
        if (producer) {
          movies.push({ year, producers: producer.trim() });
        }
      });
    });

    const producers = movies.reduce((acc: any, curr: any) => {
      acc[curr.producers] = acc[curr.producers] || [];
      acc[curr.producers].push(curr.year);
      return acc;
    }, {});

    let minInterval = Infinity;
    let maxInterval = -Infinity;
    let minProducers: IProducer[] = [];
    let maxProducers: IProducer[] = [];

    for (const producer in producers) {
      const awards = producers[producer];
      if (awards.length >= 2) {
        const interval = Math.abs(parseInt(awards[0]) - parseInt(awards[1]));
        if (interval < minInterval) {
          minInterval = interval;
          minProducers = [
            {
              producer,
              interval,
              previousWin: parseInt(awards[0]),
              followingWin: parseInt(awards[1]),
            },
          ];
        } else if (interval === minInterval) {
          minProducers.push({
            producer,
            interval,
            previousWin: parseInt(awards[0]),
            followingWin: parseInt(awards[1]),
          });
        }
        if (interval > maxInterval) {
          maxInterval = interval;
          maxProducers = [
            {
              producer,
              interval,
              previousWin: parseInt(awards[0]),
              followingWin: parseInt(awards[1]),
            },
          ];
        } else if (interval === maxInterval) {
          maxProducers.push({
            producer,
            interval,
            previousWin: parseInt(awards[0]),
            followingWin: parseInt(awards[1]),
          });
        }
      }
    }

    return {
      min: minProducers,
      max: maxProducers,
    };
  }

  async findAll() {
    const movies = await this.prisma.movie.findMany({
      select: {
        year: true,
        title: true,
        studios: true,
        producers: true,
        winner: true,
      },
    });
    return movies;
  }

  async deleteMany() {
    await this.prisma.movie.deleteMany();
  }
}
