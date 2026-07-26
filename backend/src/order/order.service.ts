import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Film, FilmDocument } from '../films/schemas/film.schema';
import { CreateOrderItemDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async createOrder(orderData: CreateOrderItemDto | CreateOrderItemDto[]) {
    // Если пришел объект, превращаем в массив
    const orderItems = Array.isArray(orderData) ? orderData : [orderData];

    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    const bookedTickets = [];

    for (const item of orderItems) {
      // Находим фильм
      const film = await this.filmModel.findOne({ id: item.film });
      if (!film) {
        throw new NotFoundException(`Film with id ${item.film} not found`);
      }

      // Находим сеанс
      const sessionIndex = film.schedule.findIndex(
        (s) => s.id === item.session,
      );
      if (sessionIndex === -1) {
        throw new NotFoundException(
          `Session with id ${item.session} not found`,
        );
      }

      const session = film.schedule[sessionIndex];

      // Проверяем, что ряд и место не выходят за пределы
      if (item.row < 1 || item.row > session.rows) {
        throw new BadRequestException(
          `Row ${item.row} is out of range (1-${session.rows})`,
        );
      }
      if (item.seat < 1 || item.seat > session.seats) {
        throw new BadRequestException(
          `Seat ${item.seat} is out of range (1-${session.seats})`,
        );
      }

      // Проверяем, что место не занято
      const seatKey = `${item.row}:${item.seat}`;

      if (session.taken && session.taken.includes(seatKey)) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      // Добавляем место в занятые
      if (!session.taken) {
        session.taken = [];
      }
      session.taken.push(seatKey);

      // Обновляем сеанс в массиве schedule
      film.schedule[sessionIndex] = session;

      // Сохраняем информацию о забронированном билете
      bookedTickets.push({
        id: uuidv4(),
        film: item.film,
        session: item.session,
        daytime: item.daytime,
        row: item.row,
        seat: item.seat,
        price: item.price,
      });

      // Сохраняем изменения в базе данных
      await film.save();
    }

    return {
      total: bookedTickets.length,
      items: bookedTickets,
    };
  }
}
