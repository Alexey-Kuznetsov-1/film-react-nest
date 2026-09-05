import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderItems: CreateOrderDto = {
    tickets: [
      {
        film: 'test-id',
        session: 'session-id',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 1,
        seat: 1,
        price: 350,
      },
    ],
  };

  const mockOrderResult = {
    total: 1,
    items: [
      {
        id: 'order-id',
        film: 'test-id',
        session: 'session-id',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 1,
        seat: 1,
        price: 350,
      },
    ],
  };

  const mockOrderService = {
    createOrder: jest.fn().mockResolvedValue(mockOrderResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order and return result', async () => {
      const result = await controller.createOrder(mockOrderItems);
      expect(result).toEqual(mockOrderResult);
      // Проверяем, что сервис вызван с массивом билетов (tickets)
      expect(service.createOrder).toHaveBeenCalledWith(mockOrderItems.tickets);
    });
  });
});