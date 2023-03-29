import { OrderType, OrderStatus, Currency } from 'src/graphql';
import { Order } from 'src/order/entities/order.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { users } from './user.fixture';

export const createOrder = (
  input: {
    amount: number;
    quantity: number;
    type: OrderType;
    status?: OrderStatus;
  },
  relations?: ('place' | 'user' | 'transactions')[],
  user?: UserEntity,
): Order => {
  return {
    id: 'order-id',
    userId: 'test',
    bankAccountId: '123',
    externalRoundId: 123,
    externalCreatedAt: 'exTimestamp',
    createdAt: 'timestamp',
    updatedAt: 'timestamp',
    status: input.status || OrderStatus.OPEN,
    currency: Currency.USD,
    type: input.type,
    amount: input.amount,
    deadline: 'deadline',
    paymentReference: 'ref',
    quantity: input.quantity,
    placeId: '123',
  };
};

export const createTransferConfirmedOrder = (
  input: {
    amount: number;
    quantity: number;
    type: OrderType;
  },
  relations?: ('place' | 'user')[],
): Order => ({
  id: 'order-id',
  userId: 'test',
  bankAccountId: '123',
  externalRoundId: 123,
  externalCreatedAt: 'exTimestamp',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  status: OrderStatus.OPEN,
  currency: Currency.USD,
  type: input.type,
  amount: input.amount,
  deadline: 'deadline',
  paymentReference: 'ref',
  quantity: input.quantity,
  placeId: '123',
  transferConfirmed: true,
});

export const findOrders = ({
  where: { status },
  relations,
}): Promise<Order[]> =>
  Promise.resolve([
    {
      id: 'order-id',
      userId: 'test',
      subscriptionAgreementId: 'subscriptionAgreementId',
      bankAccountId: '123',
      externalRoundId: 123,
      externalCreatedAt: 'exTimestamp',
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
      status: status,
      currency: Currency.USD,
      type: OrderType.BUY,
      amount: 10000,
      deadline: 'deadline',
      paymentReference: 'ref',
      quantity: 10,
      placeId: '123',
      user: relations?.includes('user') ? users.normal : undefined,
      transactions: [],
      sortTransactions: () => null,
    },
  ]);

export const orderFixture = {
  id: 'order-id',
  userId: 'test',
  subscriptionAgreementId: 'subscriptionAgreementId',
  bankAccountId: '123',
  externalRoundId: 123,
  externalCreatedAt: 'exTimestamp',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  status: OrderStatus.OPEN,
  currency: Currency.USD,
  type: OrderType.BUY,
  amount: 10000,
  deadline: 'deadline',
  paymentReference: 'ref',
  quantity: 10,
  placeId: '123',
  user: users.normal,
  transactions: [],
  sortTransactions: () => null,
};

export const getOrderByOrderId = (): Promise<Order> =>
  Promise.resolve(orderFixture);
