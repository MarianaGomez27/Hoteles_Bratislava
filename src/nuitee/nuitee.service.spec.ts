import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDependency } from '../test/utils/AutoMocker';
import { NuiteeService } from 'src/nuitee/nuitee.service';
import { NuiteeEntity } from 'src/nuitee/entities/nuitee.entity';
import {
  OrderService,
  ORDER_BUY_SUBSCRIBERS_LIMIT_US,
} from 'src/order/order.service';
import { users } from 'src/test/fixtures/user.fixture';

describe('NuiteeService', () => {
  let orderService: OrderService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          return mockDependency(token);
        }
      })
      .compile();
    orderService = moduleRef.get(OrderService);
  });

  const input = {
    placeId: 'placeId',
    slug: 'slug',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });
});
