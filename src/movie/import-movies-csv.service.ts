import { Injectable, Logger, OnModuleInit, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MovieDto } from './dto/movie.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({ scope: Scope.DEFAULT })
export class ImportMoviesCsvService implements OnModuleInit {
  private readonly logger = Logger;
  private readonly csvDirectory = path.join('src', 'csv');

  constructor(private readonly prisma: PrismaClient) {}

  async onModuleInit() {
    await this.prisma.movie.deleteMany();
    const files = this.readAllCsvInDirectory();

    files.forEach((file) => {
      this.fileSize(file);
      this.execute(file);
    });
  }

  async execute(file: string) {
    const data = this.fileToJson(file);
    return await this.prisma.movie.createMany({ data }).then(() => {
      this.logger.log(
        `CSV file ${data.length} rows successfully processed`,
        ImportMoviesCsvService.name,
      );
    });
  }

  fileToJson(file: string): MovieDto[] {
    const filePath = path.join(this.csvDirectory, file);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const lines = rawData.split('\n').slice(1).filter(Boolean);
    const objects: MovieDto[] = [];

    lines.map((line, index) => {
      const [year, title, studios, producers, winner] = line.split(';');
      const object: Partial<MovieDto> = {};
      if (year && title && studios && producers) {
        object.year = year;
        object.title = title;
        object.studios = studios;
        object.producers = producers;
        object['winner'] = winner || '';

        objects.push(object as MovieDto);
      } else {
        throw new Error(
          `Invalid object found in CSV file ${filePath} on line ${index + 2}`,
        );
      }
    });

    return objects;
  }

  fileSize(file: string): boolean {
    const filePath = path.join(this.csvDirectory, file);
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    if (fileSizeInMB < 5) return true;

    this.logger.error(
      `CSV file ${filePath} is larger than 5MB`,
      ImportMoviesCsvService.name,
    );

    return false;
  }

  readAllCsvInDirectory() {
    return fs.readdirSync(this.csvDirectory) || [];
  }
}
