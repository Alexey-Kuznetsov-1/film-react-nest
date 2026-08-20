import { Injectable } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<Film[]> {
    return this.filmsRepository.findAll();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmsRepository.findById(id);
  }
}
