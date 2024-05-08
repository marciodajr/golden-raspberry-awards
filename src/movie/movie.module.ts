import { Logger, Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { ImportMoviesCsvService } from './import-movies-csv.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [MovieController],
  providers: [MovieService, ImportMoviesCsvService, PrismaClient, Logger],
})
export class MovieModule {}
