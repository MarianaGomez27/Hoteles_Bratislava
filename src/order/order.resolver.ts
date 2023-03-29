import { Mutation, Resolver, Args, Context, Query } from '@nestjs/graphql';
import {
  Order,
  OrderInput,
  AllOrdersInput,
  SubscriptionAgreementInput,
  SubscriptionAgreementData,
  User as UserType,
  OrderQuery,
} from 'src/graphql';
import { User } from 'src/auth/auth.decorator';
import { OrderService } from './order.service';
import { UUID } from 'src/types';

@Resolver('Order')
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Mutation('confirmOrderTransfer')
  async confirmOrderTransfer(
    @Args('args') args: OrderInput,
    @Context('req') req,
  ): Promise<Order> {
    const entity = await this.orderService.confirmOrderTransfer({
      id: args.id,
      userId: req.user.profile.id,
    });
    return null;
  }

  @Query('order')
  async order(
    @Args('args') args: OrderInput,
    @User('id') userId,
  ): Promise<Order> {
    const entity = await this.orderService.getOrder({
      ...args,
      userId,
    });
    return null;
  }

  @Query('orders')
  async orders(
    @Args('args') query: OrderQuery,
    @Context('req') req,
  ): Promise<Order[]> {
    const entities = await this.orderService.getOrders({
      ...(query || {}),
      cognitoId: req.cognitoId,
    });
    return null;
  }

  @Query('allOrders')
  async allOrders(@Args('args') args: AllOrdersInput): Promise<Order[]> {
    const entities = await this.orderService.getAllOrdersTransformed(
      args.filters,
    );
    return null;
  }

  @Query('getOrdersByUserId')
  async getOrdersByUserId(@Args('userId') userId: string): Promise<Order[]> {
    const entities = await this.orderService.getOrdersByUserId(userId);
    return null;
  }
}
