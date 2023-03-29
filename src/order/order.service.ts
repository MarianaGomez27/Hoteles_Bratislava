import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, Equal, Not, In } from 'typeorm';
import { Order as OrderEntity } from './entities/order.entity';
import { AllOrdersFilters, OrderQuery, OrderStatus } from 'src/graphql';
import { PlaceService } from '../place/place.service';
import { throwOrderNotFound } from './throwers';
import { AnalyticsService } from 'src/analytics';

export const ORDER_BUY_LIMIT_PCT = 0.1;
export const ORDER_BUY_LIMIT_AMOUNT = 100000;
export const ORDER_BUY_SUBSCRIBERS_LIMIT_US = 95;

@Injectable()
export class OrderService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(forwardRef(() => PlaceService))
    private placeService: PlaceService,
    private analyticsService: AnalyticsService,
    private connection: Connection,
  ) {}

  generatePaymentReference({
    lastName,
    userId,
  }: {
    lastName: string;
    userId: string;
  }): string {
    return `${lastName.slice(0, 4).toUpperCase()}-${userId
      .slice(0, 3)
      .replace('_', '-')
      .toUpperCase()}`;
  }

  async cancelOrder(userId, { id }) {
    const order = await this.orderRepository.findOne({
      where: {
        id: Equal(id),
        userId: Equal(userId),
      },
    });
    if (!order) throwOrderNotFound();

    order.status = OrderStatus.CANCELLED;

    return await this.orderRepository.save(order);
  }

  async getOrder({
    id,
    placeId,
    userId,
  }: {
    id?: string;
    placeId?: string;
    userId: string;
  }): Promise<OrderEntity> {
    const order = id
      ? await this.getOrderById({ id, userId })
      : await this.getOrderByPlaceId({ placeId, userId });

    if (!order) {
      throw new Error(`Could not find order. 'ORDER_NOT_FOUND'`);
      //  {
      // statusCode: 400,
      // orderId: id,
      // placeId,
      // userId,
      // });
    }
    return order;
  }

  async getOrderById({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      relations: ['user', 'place', 'transactions'],
      where: {
        id: Equal(id),
        userId: Equal(userId),
      },
    });
  }

  async getOrderByOrderId({ id }: { id: string }): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      relations: ['user', 'place', 'transactions'],
      where: {
        id: Equal(id),
      },
    });
  }

  async getOrderByPlaceId({
    placeId,
    userId,
  }: {
    placeId: string;
    userId: string;
  }) {
    return await this.orderRepository.findOne({
      relations: ['user', 'place', 'transactions'],
      where: {
        placeId: Equal(placeId),
        userId: Equal(userId),
      },
    });
  }

  async getOrders({
    cognitoId,
    status,
  }: { cognitoId: string } & OrderQuery): Promise<OrderEntity[]> {
    const where: Record<string, unknown> = {
      user: { cognitoId: Equal(cognitoId) },
    };
    if (status) {
      where.status = In(status);
    }
    return this.orderRepository.find({
      relations: ['user', 'place'],
      where,
    });
  }

  async getAllOrders(filters: AllOrdersFilters): Promise<OrderEntity[]> {
    const filterObject = {
      ...(filters.status && { status: filters.status }),
    };
    return await this.orderRepository.find({
      relations: ['user', 'place', 'transactions'],
      where: filterObject,
    });
  }

  async getAllOrdersTransformed(
    filters: AllOrdersFilters,
  ): Promise<OrderEntity[]> {
    return this.getAllOrders(filters);
  }

  async getOrdersByUserId(userId: string): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      relations: ['user', 'place'],
      where: { userId: userId },
    });
  }

  async confirmOrderTransfer({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<OrderEntity> {
    const order = await this.getOrder({ id, userId });
    order.transferConfirmed = true;

    return this.orderRepository.save(order);
  }

  async setOrderStatus({
    id,
    status,
  }: {
    id: string;
    status: OrderStatus;
  }): Promise<OrderEntity> {
    const order = await this.getOrderByOrderId({ id });

    if (!order) {
      throw new Error(`Could not find order - setOrderStatus - orderid ${id}`);
    }
    order.status = status;
    return await this.orderRepository.save(order);
  }
}
