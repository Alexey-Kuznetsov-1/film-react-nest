import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find({
      relations: ['schedule'],
    });
  }

  async findById(id: string): Promise<Film | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    
    if (film && film.schedule) {
      film.schedule.sort((a, b) => {
        return new Date(a.daytime).getTime() - new Date(b.daytime).getTime();
      });
    }
    
    return film;
  }

  async create(filmData: Partial<Film>): Promise<Film> {
    const film = this.filmRepository.create(filmData);
    return this.filmRepository.save(film);
  }

  async update(id: string, filmData: Partial<Film>): Promise<Film | null> {
    await this.filmRepository.update({ id }, filmData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.filmRepository.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async updateScheduleTaken(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        filmId: filmId,
        id: sessionId,
      },
    });

    if (!schedule) {
      return false;
    }

    if (schedule.taken && schedule.taken.includes(seatKey)) {
      return false;
    }

    if (!schedule.taken) {
      schedule.taken = [];
    }
    schedule.taken.push(seatKey);

    await this.scheduleRepository.save(schedule);
    return true;
  }
}