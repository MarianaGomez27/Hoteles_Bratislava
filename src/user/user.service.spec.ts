import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User as UserEntity } from './entities/user.entity';
import { users as userFixtures } from '../test/fixtures/user.fixture';
import { Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { WhitelistEntity } from 'src/user/entities';

const updateUserInputMock = {};

const createMockQueryBuilder = () => ({
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  loadAllRelationIds: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockReturnValue([[], 0]),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;
  let mockQueryBuilder: ReturnType<typeof createMockQueryBuilder>;

  beforeAll(async () => {
    mockQueryBuilder = createMockQueryBuilder();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: () => mockQueryBuilder,
          },
        },
        {
          provide: getRepositoryToken(WhitelistEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
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
      ],
    }).compile();

    userRepository = moduleRef.get(getRepositoryToken(UserEntity));
    userService = moduleRef.get(UserService);
  });

  describe('Function -> updateUser', () => {
    afterEach(() => jest.resetAllMocks());

    describe('when user id does not exist', () => {
      beforeEach(() => {
        const mockFindOne = jest.fn(() => Promise.resolve(undefined));
        jest.spyOn(userRepository, 'findOne').mockImplementation(mockFindOne);
      });

      it('should throw error', async () => {
        await expect(async () => {
          await userService.updateUser(updateUserInputMock, `123`);
        }).rejects.toBeInstanceOf(NotFoundException);
      });
    });

    describe('when user id exists', () => {
      beforeEach(() => {
        const mockFindOne = jest.fn(() => Promise.resolve(userFixtures.normal));
        jest.spyOn(userRepository, 'findOne').mockImplementation(mockFindOne);

        const mockSave = jest.fn(() => Promise.resolve(userFixtures.normal));
        jest.spyOn(userRepository, 'save').mockImplementation(mockSave);
      });

      it('should return user object', async () => {
        const result = await userService.updateUser(updateUserInputMock, `123`);
        expect(result).not.toBe(undefined);
        expect(userRepository.findOne).toBeCalled();
      });
    });

    describe('when multiple fields are updated at once', () => {
      const existingObject = { ...userFixtures.normal };

      const updatedElements = {
        id: existingObject.id,
        firstName: `UpdatedName`,
        email: `UpdatedEmail`,
      };

      beforeEach(() => {
        const mockFindOne = jest.fn(() => Promise.resolve(existingObject));
        const mockSave = jest.fn(() =>
          Promise.resolve({
            ...userFixtures.normal,
            ...updatedElements,
          }),
        );

        jest.spyOn(userRepository, 'findOne').mockImplementation(mockFindOne);
        jest.spyOn(userRepository, 'save').mockImplementation(mockSave);
      });

      it('should only try to update new fields', async () => {
        await userService.updateUser(updatedElements, `123`);
        expect(userRepository.findOne).toBeCalled();
        expect(userRepository.save).toBeCalledWith({
          ...userFixtures.normal,
          ...updatedElements,
        });
      });
    });
  });

  describe('Function -> queryUser', () => {
    beforeEach(() => {
      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockImplementation(
          () =>
            (mockQueryBuilder =
              createMockQueryBuilder()) as unknown as SelectQueryBuilder<UserEntity>,
        );
    });

    describe(`with parameters ("${userFixtures.normal.email}")`, () => {
      const params: [string] = [userFixtures.normal.email];

      it('should have been called "orWhere(id)"', async () => {
        await userService.queryUser(...params);
        expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
          'id::varchar = :query',
          expect.objectContaining({ query: params[0] }),
        );
      });

      it('should have been called "orWhere(email)"', async () => {
        await userService.queryUser(...params);
        expect(mockQueryBuilder.orWhere).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            email: ILike(`%${userFixtures.normal.email}%`),
          }),
        );
      });

      it('should have been called "orWhere(firstName)" and "orWhere(lastName)"', async () => {
        await userService.queryUser(...params);
        expect(mockQueryBuilder.orWhere).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({
            firstName: ILike(`%${params[0]}%`),
          }),
        );
        expect(mockQueryBuilder.orWhere).toHaveBeenNthCalledWith(
          4,
          expect.objectContaining({
            lastName: ILike(`%${params[0]}%`),
          }),
        );
      });

      it('should have not been called "limit(X)" or "offset(X)"', async () => {
        await userService.queryUser(...params);

        expect(mockQueryBuilder.limit).not.toHaveBeenCalled();
        expect(mockQueryBuilder.offset).not.toHaveBeenCalled();
      });

      it('should have not been called "orderBy(X)"', async () => {
        await userService.queryUser(...params);

        expect(mockQueryBuilder.orderBy).not.toHaveBeenCalled();
      });
    });

    describe(`with parameters ("${userFixtures.normal.firstName} ${userFixtures.normal.lastName}", { limit: 10, offset: 0, orderBy: ['createdAt', 'DESC'] })`, () => {
      const params: [string, any] = [
        `${userFixtures.normal.firstName} ${userFixtures.normal.lastName}`,
        { limit: 10, offset: 0, orderBy: ['id', 'DESC'] },
      ];

      it('should have been called "orWhere(id)"', async () => {
        await userService.queryUser(...params);
        expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
          'id::varchar = :query',
          expect.objectContaining({ query: params[0] }),
        );
      });

      it('should have been called "orWhere(email)"', async () => {
        await userService.queryUser(...params);
        expect(mockQueryBuilder.orWhere).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            email: ILike(`%${params[0]}%`),
          }),
        );
      });

      it('should not have been called "orWhere(firstName)" and "orWhere(lastName)" but "orWhere(firstName, lastName)"', async () => {
        await userService.queryUser(...params);

        expect(mockQueryBuilder.orWhere).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({
            firstName: ILike(`%${userFixtures.normal.firstName}%`),
            lastName: ILike(`%${userFixtures.normal.lastName}%`),
          }),
        );
      });

      it('should have been called "limit(10)" & "offset(0)"', async () => {
        await userService.queryUser(...params);

        expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
        expect(mockQueryBuilder.offset).toHaveBeenCalledWith(0);
      });

      it('should have been called "orderBy(createdAt, DESC)"', async () => {
        await userService.queryUser(...params);

        expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
          expect.objectContaining({ 'User.id': 'DESC' }),
        );
      });
    });
  });
});
