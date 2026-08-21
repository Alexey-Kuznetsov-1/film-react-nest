import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FilmsRepository } from '../films/films.repository';
import { CreateOrderItemDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(orderData: CreateOrderItemDto | CreateOrderItemDto[]) {
    const orderItems = Array.isArray(orderData) ? orderData : [orderData];

    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    const bookedTickets = [];

    // Проверяем все билеты на валидность
    for (const item of orderItems) {
      const film = await this.filmsRepository.findById(item.film);
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

    // Бронируем места
    for (const item of orderItems) {
      const seatKey = `${item.row}:${item.seat}`;

      const updated = await this.filmsRepository.updateScheduleTaken(
        item.film,
        item.session,
        seatKey,
      );

      if (!updated) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      const film = await this.filmsRepository.findById(item.film);
      if (!film) {
        throw new NotFoundException(`Film with id ${item.film} not found`);
      }

      const session = film.schedule.find(s => s.id === item.session);
      if (!session) {
        throw new NotFoundException(`Session with id ${item.session} not found`);
      }

      bookedTickets.push({
        id: uuidv4(),
        film: item.film,
        session: item.session,
        daytime: session.daytime,
        row: item.row,
        seat: item.seat,
        price: session.price,
      });
    }

    return {
      total: bookedTickets.length,
      items: bookedTickets,
    };
  }
}