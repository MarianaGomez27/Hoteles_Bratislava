import { Repository, Connection, Equal, Not, In } from 'typeorm';
import { Test } from '@nestjs/testing';
import { OrderService, ORDER_BUY_SUBSCRIBERS_LIMIT_US } from './order.service';
import { Order } from './entities/order.entity';
import { OrderType, User, OrderStatus } from '../graphql';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDependency } from '../test/utils/AutoMocker';
import { PlaceService } from 'src/place/place.service';
import {
  createOrder,
  createTransferConfirmedOrder,
} from '../test/fixtures/order.fixture';
import { orderFixture } from '../test/fixtures/order.fixture';
import { Logger } from '@nestjs/common';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderEntity: Repository<Order>;
  let placeService: PlaceService;
  let connection: Connection;

  const mockConnection = () => ({
    transaction: jest.fn(),
  });

  const input = {
    amount: 10,
    quantity: 1,
    type: OrderType.BUY,
    cognitoId: '4',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: Connection,
          useFactory: mockConnection,
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(Order)) {
          return {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          };
        }
        if (typeof token === 'function') {
          return mockDependency(token);
        }
      })
      .compile();

    orderService = moduleRef.get(OrderService);
    placeService = moduleRef.get(PlaceService);
    orderEntity = moduleRef.get(getRepositoryToken(Order));
    connection = moduleRef.get<Connection>(Connection);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Function -> createOrder', () => {
    beforeEach(() => {
      jest
        .spyOn(orderEntity, 'save')
        .mockImplementation(async () => createOrder(input, ['user']));
    });
  });

  describe('Function -> getOrder', () => {
    beforeEach(() => {
      jest
        .spyOn(orderEntity, 'findOne')
        .mockImplementation(async () => createOrder(input, ['place', 'user']));
    });

    describe('when the order is not found', () => {
      beforeEach(() => {
        jest
          .spyOn(orderEntity, 'findOne')
          .mockImplementation(async () => undefined);
      });
      it('should throw ORDER_NOT_FOUND error', async () => {
        let error: ApolloError;
        try {
          await orderService.getOrder({ id: '123', userId: '456' });
        } catch (err) {
          error = err;
        }

        expect(error.extensions.code).toBe('ORDER_NOT_FOUND');
      });
    });
  });

  describe('Function -> getOrderByOrderId', () => {
    beforeEach(() => {
      jest
        .spyOn(orderEntity, 'findOne')
        .mockImplementation(async () => createOrder(input, ['place']));
    });
    describe('returns an order object', () => {
      it('should return the order for the id', async () => {
        const response = await orderService.getOrderByOrderId({
          id: 'order-id',
        });
        expect(response.id).toBe('order-id');
      });
    });

    describe('inactive order types are filtered out', () => {
      it('filter out inactive orders', async () => {
        await orderService.getOrderByOrderId({
          id: 'order-id',
        });

        expect(orderEntity.findOne).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              id: Equal('order-id'),
            },
          }),
        );
      });
    });
  });

  describe('Function -> setOrderStatus', () => {
    describe('when updating the status of an order', () => {
      beforeEach(() => {
        jest
          .spyOn(orderEntity, 'findOne')
          .mockImplementation(async () => createOrder(input, ['place']));

        jest.spyOn(orderEntity, 'save').mockImplementation(async () => {
          return {
            ...orderFixture,
            status: OrderStatus.FULFILLED,
          };
        });
      });

      it('return an object with the updated status', async () => {
        const response = await orderService.setOrderStatus({
          id: 'order-id',
          status: OrderStatus.FULFILLED,
        });

        expect(response).toBeDefined();
        expect(response.status).toBe(OrderStatus.FULFILLED);
      });
    });

    describe('when update fails when order cannot be found', () => {
      beforeEach(() => {
        jest
          .spyOn(orderEntity, 'findOne')
          .mockImplementation(async () => undefined);
      });

      it('should throw an error', async () => {
        let error;
        try {
          await orderService.setOrderStatus({
            id: 'order-id',
            status: OrderStatus.FULFILLED,
          });
        } catch (err) {
          console.log(err);
          error = err;
        }

        expect(error.message).toContain(`Could not find order`);
      });
    });
  });

  describe('Function -> confirmOrderTransfer', () => {
    beforeEach(() => {
      jest
        .spyOn(orderEntity, 'findOne')
        .mockImplementation(async () => createOrder(input, ['place', 'user']));

      jest
        .spyOn(orderEntity, 'save')
        .mockImplementation(async () =>
          createTransferConfirmedOrder(input, ['place', 'user']),
        );
    });

    describe('When no errors occur', () => {
      it('should return transferConfirmed boolean', async () => {
        const response = await orderService.confirmOrderTransfer({
          id: 'order-id',
          userId: 'user-id',
        });

        expect(response.transferConfirmed).toBe(true);
      });
    });

    describe('When and error occurs', () => {
      beforeEach(() => {
        jest.spyOn(orderEntity, 'save').mockImplementation(async () => {
          throw new Error('Database failed');
        });
      });
      it('should throw the error', async () => {
        try {
          await orderService.confirmOrderTransfer({
            id: 'order-id',
            userId: 'user-id',
          });
        } catch (err) {
          expect(err.message).toBe('Database failed');
        }
      });
    });
  });
});
