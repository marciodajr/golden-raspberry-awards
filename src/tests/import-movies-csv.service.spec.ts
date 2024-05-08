import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { ImportMoviesCsvService } from '../movie/import-movies-csv.service';
import { MovieService } from '../movie/movie.service';

describe('ImportMoviesCsvService', () => {
  let importMoviesCsvService: ImportMoviesCsvService;
  let movieService: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportMoviesCsvService, MovieService, PrismaClient],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    importMoviesCsvService = module.get<ImportMoviesCsvService>(
      ImportMoviesCsvService,
    );
  });

  afterEach(async () => {
    await movieService.deleteMany();
  });

  it('should check if CSV file size is less than 5 MB', () => {
    const files = importMoviesCsvService.readAllCsvInDirectory();

    files.forEach((file: string) => {
      const fileSizeLess = importMoviesCsvService.fileSize(file);
      expect(fileSizeLess).toBeTruthy();
    });
  });

  it('should import movies from CSV with correct data', async () => {
    const files = importMoviesCsvService.readAllCsvInDirectory();

    files.forEach(async (file: string) => {
      const expectedMovies = importMoviesCsvService.fileToJson(file);

      expect(expectedMovies.length).toBeGreaterThan(0);

      expectedMovies.forEach((row) => {
        expect(row).toHaveProperty('year');
        expect(row).toHaveProperty('title');
        expect(row).toHaveProperty('studios');
        expect(row).toHaveProperty('producers');
        expect(row).toHaveProperty('winner');
      });

      await importMoviesCsvService.execute(file);

      const importedMovies = await movieService.findAll();

      expect(importedMovies).toEqual(expectedMovies);
    });
  });
});
