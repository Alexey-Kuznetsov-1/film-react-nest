export class CreateOrderItemDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDto {
  tickets: CreateOrderItemDto[];
  email?: string;
  phone?: string;
}
