import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { NotFoundException } from '@nestjs/common';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilm = {
    id: 'test-id',
    title: 'Test Film',
    rating: 8.5,
    director: 'Test Director',
    tags: ['Action'],
    about: 'About film',
    description: 'Description',
    image: '/image.jpg',
    cover: '/cover.jpg',
    schedule: [
      {
        id: 'schedule-1',
        daytime: '2024-06-28T10:00:53+03:00',
        hall: '1',
        rows: 5,
        seats: 10,
        price: 350,
        taken: [],
        filmId: 'test-id',
        film: null as any,
      },
    ],
  };

  const mockFilmsService = {
    findAll: jest.fn().mockResolvedValue([mockFilm]),
    findById: jest.fn().mockResolvedValue(mockFilm),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms', () => {
    it('should return list of films', async () => {
      const result = await controller.getFilms();
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('test-id');
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getFilmSchedule', () => {
    it('should return schedule for existing film', async () => {
      const result = await controller.getFilmSchedule('test-id');
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe('schedule-1');
      expect(service.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException if film not found', async () => {
      mockFilmsService.findById.mockResolvedValueOnce(null);
      await expect(controller.getFilmSchedule('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});