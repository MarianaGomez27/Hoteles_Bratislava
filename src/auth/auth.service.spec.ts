import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from 'src/user/entities';
import { AuthService } from './auth.service';
import { Connection } from 'typeorm';
import { ConflictException, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { WhitelistEntity } from 'src/user/entities/whitelist.entity';
import { FeatureFlagService } from 'src/feature-flag/feature-flag.service';
import { ConfigService } from '@nestjs/config';

class MockCognitoError extends Error {
  code: string;
  constructor(msg: string) {
    super(msg);
    this.code = msg;
  }
}

const mockData = {
  signup: {
    id: 'signupTestId',
    createdAt: new Date('2000-01-01T10:00:00.000Z'),
    cognitoId: 'signupTestCognitoIt',
    firstName: 'signupTestFirstName',
    lastName: 'signupTestLastName',
    country: 'GBR',
    state: '',
    email: 'signuptest@test.com',
    password: 'signupTestPassword',
    externalId: '123',
    source: 'facebook',
  },
  login: {
    id: 'loginTestId',
    createdAt: new Date('2000-01-01T10:00:00.000Z'),
    cognitoId: 'loginTestCognitoIt',
    firstName: 'loginTestFirstName',
    lastName: 'loginTestLastName',
    country: 'GBR',
    state: '',
    email: 'logintest@test.com',
    password: 'loginTestPassword',
    token: 'loginTestToken',
    externalId: '123',
  },
};

describe('AuthService', () => {
  let authService: AuthService;
  let connection: Connection;
  let userService: UserService;

  let mockCognitoSignup;
  let mockCognitoLogin;
  let mockUserCreate;
  let mockUserFindOne;
  let mockEntityManager;
  let mockConnectionTransaction;
  let mockGetWhitelistEntryByEmail;

  const getMockUserCreate = () =>
    jest.fn((arg) => ({ ...arg, id: 'signupTestId' }));

  const getMockDeclarationSave = () => jest.fn(async (arg) => ({ ...arg }));

  const getMockEntityManager = () => ({
    save: jest.fn(async (arg) => arg),
    update: jest.fn(),
  });

  const getMockConnectionTransaction = (mockEntityManager) => {
    return jest.fn(async (callback) => await callback(mockEntityManager));
  };

  const getMockGetWhitelistEntryByEmail = () =>
    jest.fn(
      async ({ email }): Promise<WhitelistEntity> =>
        Promise.resolve({
          id: 'uuid',
          email,
        } as WhitelistEntity),
    );

  const getMockIsFeatureEnabled = () => jest.fn(() => true);

  const getMockGetFeature = () =>
    jest.fn(() => Promise.resolve({ isEnabled: false, value: ['GBR'] }));

  const getMockCountryFindOneOrFail = () =>
    jest.fn((country) => Promise.resolve(country));

  let mockIsFeatureEnabled: ReturnType<typeof getMockIsFeatureEnabled>;
  let mockGetFeature: ReturnType<typeof getMockGetFeature>;
  let mockCountryFindOneOrFail: ReturnType<typeof getMockCountryFindOneOrFail>;

  beforeEach(async () => {
    mockUserCreate = getMockUserCreate();
    mockEntityManager = getMockEntityManager();
    mockConnectionTransaction = getMockConnectionTransaction(mockEntityManager);
    mockGetWhitelistEntryByEmail = getMockGetWhitelistEntryByEmail();
    mockIsFeatureEnabled = getMockIsFeatureEnabled();
    mockGetFeature = getMockGetFeature();
    mockCountryFindOneOrFail = getMockCountryFindOneOrFail();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: FeatureFlagService,
          useValue: {
            isFeatureEnabled: mockIsFeatureEnabled,
            getFeature: mockGetFeature,
          },
        },
        {
          provide: UserService,
          useValue: {
            getWhitelistEntryByEmail: mockGetWhitelistEntryByEmail,
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: mockUserCreate,
            findOne: mockUserFindOne,
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            warn: jest.fn(),
            log: jest.fn(),
          },
        },
        {
          provide: Connection,
          useValue: {
            transaction: mockConnectionTransaction,
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    connection = moduleRef.get(Connection);
    userService = moduleRef.get(UserService);
  });

  afterEach(() => jest.resetAllMocks());

  describe('user registration', () => {
    beforeEach(() => {
      return;
    });
  });

  describe('user registration error codes', () => {
    beforeEach(() => {
      return;
    });
  });

  describe('user login', () => {
    it('should login user', async () => {
      const expectedLoginPayload = {
        token: mockData.login.token,
        user: {
          id: mockData.login.id,
          cognitoId: mockData.login.cognitoId,
          firstName: mockData.login.firstName,
          lastName: mockData.login.lastName,
          country: mockData.login.country,
          email: mockData.login.email,
        },
      };

      expect(mockCognitoLogin).toHaveBeenCalled();
      expect(mockUserFindOne).toHaveBeenCalled();
    });
  });
});
