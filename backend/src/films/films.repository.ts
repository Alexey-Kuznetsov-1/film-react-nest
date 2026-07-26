import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async create(filmData: Partial<Film>): Promise<Film> {
    const film = new this.filmModel(filmData);
    return film.save();
  }

  async update(id: string, filmData: Partial<Film>): Promise<Film | null> {
    return this.filmModel
      .findOneAndUpdate({ id }, filmData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.filmModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }
}
