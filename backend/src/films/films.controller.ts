import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<{ total: number; items: FilmDto[] }> {
    const items = await this.filmsService.findAll();
    return { total: items.length, items };
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    const film = await this.filmsService.findById(id);
    if (!film) {
      return { total: 0, items: [] };
    }
    return { total: film.schedule?.length || 0, items: film.schedule || [] };
  }
}