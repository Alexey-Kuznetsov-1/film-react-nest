import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Film, FilmDocument } from '../films/schemas/film.schema';
import { CreateOrderItemDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Film.name) private filmModel: Model<FilmDocument>,
  ) {}

  async createOrder(orderData: CreateOrderItemDto | CreateOrderItemDto[]) {
    const orderItems = Array.isArray(orderData) ? orderData : [orderData];

    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    const bookedTickets = [];

    // Сначала проверяем все билеты на валидность
    for (const item of orderItems) {
      const film = await this.filmModel.findOne({ id: item.film });
      if (!film) {
        throw new NotFoundException(`Film with id ${item.film} not found`);
      }

      const session = film.schedule.find(s => s.id === item.session);
      if (!session) {
        throw new NotFoundException(`Session with id ${item.session} not found`);
      }

      if (item.row < 1 || item.row > session.rows) {
        throw new BadRequestException(`Row ${item.row} is out of range (1-${session.rows})`);
      }
      if (item.seat < 1 || item.seat > session.seats) {
        throw new BadRequestException(`Seat ${item.seat} is out of range (1-${session.seats})`);
      }
    }

    // Бронируем места атомарно
    for (const item of orderItems) {
      const seatKey = `${item.row}:${item.seat}`;

      // Атомарное обновление - добавляем место только если его нет в taken
      const result = await this.filmModel.findOneAndUpdate(
        {
          id: item.film,
          'schedule.id': item.session,
          'schedule.taken': { $ne: seatKey },
        },
        {
          $push: { 'schedule.$.taken': seatKey },
        },
        {
          new: true,
        },
      );

      if (!result) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      // Находим обновленный сеанс, чтобы взять price и daytime из БД
      const updatedFilm = await this.filmModel.findOne({ id: item.film });
      const session = updatedFilm.schedule.find(s => s.id === item.session);

      bookedTickets.push({
        id: uuidv4(),
        film: item.film,
        session: item.session,
        daytime: session.daytime, // берем из БД
        row: item.row,
        seat: item.seat,
        price: session.price, // берем из БД
      });
    }

    return {
      total: bookedTickets.length,
      items: bookedTickets,
    };
  }
}