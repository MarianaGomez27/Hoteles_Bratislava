import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from 'src/user/entities';
import { Connection } from 'typeorm';
import { ConflictException, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { WhitelistEntity } from 'src/user/entities/whitelist.entity';
import { FeatureFlagService } from 'src/feature-flag/feature-flag.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

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
  let mockDeclarationSave;
  let mockEntityManager;
  let mockConnectionTransaction;
  let mockSynchHoldingsforInvestor;
  let mockGetWhitelistEntryByEmail;

  const getMockEntityManager = () => ({
    save: jest.fn(async (arg) => arg),
    update: jest.fn(),
  });

  const getMockConnectionTransaction = (mockEntityManager) => {
    return jest.fn(async (callback) => await callback(mockEntityManager));
  };

  const getMockCountryFindOneOrFail = () =>
    jest.fn((country) => Promise.resolve(country));

  let mockCountryFindOneOrFail: ReturnType<typeof getMockCountryFindOneOrFail>;

  beforeEach(async () => {
    mockEntityManager = getMockEntityManager();
    mockConnectionTransaction = getMockConnectionTransaction(mockEntityManager);
    mockCountryFindOneOrFail = getMockCountryFindOneOrFail();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getWhitelistEntryByEmail: mockGetWhitelistEntryByEmail,
          },
        },
        {
          provide: getRepositoryToken(Declaration),
          useValue: {
            save: mockDeclarationSave,
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
        {
          provide: PubSubService,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => mockAuthConfig),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    cognitoService = moduleRef.get<CognitoService>(CognitoService);
    connection = moduleRef.get(Connection);
    synchroniserService = moduleRef.get(SynchroniserService);
    userService = moduleRef.get(UserService);
  });

  afterEach(() => jest.resetAllMocks());

  describe('begin signup', () => {
    it('should throw conflict error if user email is already used', async () => {
      const message = 'Email already exists';
      jest
        .spyOn(authService, 'ensureEmailNotInUse')
        .mockImplementation(() =>
          Promise.reject(new ConflictException(message)),
        );
      expect.assertions(1);
      try {
        await authService.beginSignup('foo@example.com', 'Foo', 'Bar');
      } catch (err) {
        expect(err.message).toEqual(message);
      }
    });
  });

  describe('user registration', () => {
    beforeEach(() => {
      jest
        .spyOn(authService, 'ensureEmailNotInUse')
        .mockImplementation(() => Promise.resolve(null));
    });

    describe('country allowlist', () => {
      it('should signup with allowlist disabled', async () => {
        mockGetFeature.mockResolvedValue({ isEnabled: false, value: [] });

        await authService.completeSignup({
          ...mockData.signup,
        });

        expect(mockGetFeature).toHaveBeenCalled();
        expect(mockEntityManager.save).toHaveBeenCalledTimes(2);
        expect(mockEntityManager.update).toHaveBeenCalledTimes(1);
      });
    });

    it('should successfully update whitelist ', async () => {
      await authService.completeSignup({
        ...mockData.signup,
      });

      expect(mockConnectionTransaction).toHaveBeenCalled();
      expect(mockCognitoSignup).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalledTimes(2);
      expect(mockEntityManager.update).toHaveBeenCalledTimes(1);
    });

    it('should create user for already existing securitize investors', async () => {
      const expectedUser = {
        id: mockData.signup.id,
        cognitoId: mockData.signup.cognitoId,
        firstName: mockData.signup.firstName,
        lastName: mockData.signup.lastName,
        country: mockData.signup.country,
        email: mockData.signup.email,
      };

      const user = await authService.completeSignup({
        ...mockData.signup,
      });

      expect(user).toMatchObject(expectedUser);

      expect(mockCognitoSignup).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
      expect(synchroniserService.synchHoldingsforInvestor).toHaveBeenCalled();
    });
  });

  describe('user registration error codes', () => {
    beforeEach(() => {
      jest
        .spyOn(authService, 'ensureEmailNotInUse')
        .mockImplementation(() => Promise.resolve(null));
    });

    it('should throw ERROR_000 if empty parameters (firstNamem, lastName)', async () => {
      const expectedError = { customCode: 'ERROR_000' };

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          firstName: '',
          lastName: '',
        });
      } catch (err) {
        customError = err;
      }

      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_001 if invalid country', async () => {
      const expectedError = { customCode: 'ERROR_001' };

      mockCountryFindOneOrFail.mockRejectedValue({});

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          country: 'INVALID_COUNTRY',
        });
      } catch (err) {
        customError = err;
      }

      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_002 if invalid state', async () => {
      const expectedError = { customCode: 'ERROR_002' };

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          country: 'USA',
          state: 'INVALID_STATE',
        });
      } catch (err) {
        customError = err;
      }

      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_003 if email was already registered', async () => {
      const expectedError = { customCode: 'ERROR_003' };

      const MockCognitoSignupError = jest.fn((): Promise<ISignUpResult> => {
        throw new MockCognitoError('UsernameExistsException');
      });

      jest
        .spyOn(cognitoService, 'signup')
        .mockImplementation(MockCognitoSignupError);

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          country: 'GBR',
          state: '',
        });
      } catch (err) {
        customError = err;
      }
      expect(MockCognitoSignupError).toHaveBeenCalled();
      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_004 if password is invalid (does not follow the policies)', async () => {
      const expectedError = { customCode: 'ERROR_004' };

      const MockCognitoSignupError = jest.fn((): Promise<ISignUpResult> => {
        throw new MockCognitoError('InvalidPasswordException');
      });

      jest
        .spyOn(cognitoService, 'signup')
        .mockImplementation(MockCognitoSignupError);

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          country: 'GBR',
          state: '',
          password: 'aaaaaaaa',
        });
      } catch (err) {
        customError = err;
      }
      expect(MockCognitoSignupError).toHaveBeenCalled();
      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_005 if email is not an email', async () => {
      const expectedError = { customCode: 'ERROR_005' };

      const MockCognitoSignupError = jest.fn((): Promise<ISignUpResult> => {
        throw new MockCognitoError('InvalidParameterException');
      });

      jest
        .spyOn(cognitoService, 'signup')
        .mockImplementation(MockCognitoSignupError);

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          email: 'bad_email',
          country: 'GBR',
          state: '',
        });
      } catch (err) {
        customError = err;
      }
      expect(MockCognitoSignupError).toHaveBeenCalled();
      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_006 if unsupported cognito error', async () => {
      const expectedError = { customCode: 'ERROR_006' };

      const MockCognitoSignupError = jest.fn((): Promise<ISignUpResult> => {
        throw new MockCognitoError('OTHER_CODE');
      });

      jest
        .spyOn(cognitoService, 'signup')
        .mockImplementation(MockCognitoSignupError);

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          country: 'GBR',
          state: '',
        });
      } catch (err) {
        customError = err;
      }
      expect(MockCognitoSignupError).toHaveBeenCalled();
      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_010 if user not saved into database', async () => {
      const expectedError = { customCode: 'ERROR_010' };

      const MockTransaction = jest.fn((): Promise<User> => {
        throw new Error('ERROR');
      });

      jest.spyOn(connection, 'transaction').mockImplementation(MockTransaction);

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          country: 'GBR',
          state: '',
        });
      } catch (err) {
        customError = err;
      }

      expect(MockTransaction).toHaveBeenCalled();
      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_011 if user is not on whitelist', async () => {
      const expectedError = { customCode: 'ERROR_011' };

      const MockWhitelist = jest.fn(
        (): Promise<WhitelistEntity> => Promise.reject(undefined),
      );

      jest
        .spyOn(userService, 'getWhitelistEntryByEmail')
        .mockImplementation(MockWhitelist);

      let customError;
      try {
        await authService.completeSignup({
          ...mockData.signup,
          country: 'GBR',
          state: '',
        });
      } catch (err) {
        customError = err;
      }

      expect(MockWhitelist).toHaveBeenCalled();
      expect(customError).toMatchObject(expectedError);
    });

    it('should throw ERROR_014 if user email is already used', async () => {
      jest
        .spyOn(authService, 'ensureEmailNotInUse')
        .mockImplementation(() =>
          Promise.reject(new ConflictException('Email already exists')),
        );
      const expectedError = { customCode: 'ERROR_014' };
      expect.assertions(1);
      try {
        await authService.completeSignup({
          ...mockData.signup,
          country: 'GBR',
          state: '',
        });
      } catch (err) {
        expect(err).toMatchObject(expectedError);
      }
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

      jest
        .spyOn(authService, 'getAccessToken')
        .mockImplementation(() => mockData.login.token);

      const loginPayload = await authService.login(
        mockData.login.email,
        mockData.login.password,
      );

      expect(loginPayload).toMatchObject(expectedLoginPayload);

      expect(mockCognitoLogin).toHaveBeenCalled();
      expect(authService.getAccessToken).toHaveBeenCalled();
      expect(mockUserFindOne).toHaveBeenCalled();
    });
  });
});
