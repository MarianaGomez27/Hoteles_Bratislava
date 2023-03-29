import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Equal, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { WhitelistEntity } from 'src/user/entities';
import { CreateUserToReviewDto, UpdateProfileDto } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WhitelistEntity)
    private readonly whitelistRepository: Repository<WhitelistEntity>,
    private readonly logger: Logger,
  ) {}

  async getWhitelistEntryByEmail(email: string): Promise<WhitelistEntity> {
    const whitelistEntry = await this.whitelistRepository.findOneOrFail({
      where: { email: ILike(email) },
    });

    return whitelistEntry;
  }

  async getUser(userId: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: Equal(userId) },
      loadRelationIds: true,
    });
    return user;
  }

  async getUserByAuth0Id(auth0Id: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: { externalId: Equal(auth0Id) },
      loadRelationIds: true,
    });
    return user;
  }

  async getUsersByName(name: string): Promise<UserEntity[]> {
    let users: UserEntity[];

    if (name) {
      users = await this.userRepository.find({
        where: [
          {
            firstName: ILike(`%${name}%`),
          },
          {
            fathersLastName: ILike(`%${name}%`),
          },
        ],
        order: {
          id: `DESC`,
        },
        loadRelationIds: true,
      });
    } else {
      users = await this.userRepository.find({
        take: 50,
        loadRelationIds: true,
      });
    }

    return users;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      loadRelationIds: true,
    });
  }

  async getUserByExternalId(externalId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { externalId: Equal(externalId) },
    });

    return user;
  }

  async queryUser(
    query: string,
    {
      limit,
      offset,
      orderBy,
    }: {
      offset?: number;
      limit?: number;
      orderBy?: [keyof UserEntity, 'DESC' | 'ASC'];
    } = {},
  ): Promise<[UserEntity[], number]> {
    const sanitizedQuery = query.trim() || '';
    let sqlQuery = this.userRepository
      .createQueryBuilder()
      .orWhere('id::varchar = :query', { query: sanitizedQuery })
      .orWhere({
        email: ILike(sanitizedQuery ? `%${sanitizedQuery}%` : '%'),
      });

    const [firstName, lastName] = query.split(' ').map((x) => x.trim());
    if (firstName && lastName) {
      sqlQuery = sqlQuery.orWhere({
        firstName: ILike(`%${firstName}%`),
        lastName: ILike(`%${lastName}%`),
      });
    } else {
      sqlQuery = sqlQuery
        .orWhere({
          firstName: ILike(sanitizedQuery ? `%${sanitizedQuery}%` : '%'),
        })
        .orWhere({
          lastName: ILike(sanitizedQuery ? `%${sanitizedQuery}%` : '%'),
        });
    }

    if (orderBy) {
      const [orderByField, orderType] = orderBy || [];
      sqlQuery = sqlQuery.orderBy({ [`User.${orderByField}`]: orderType });
    }

    if (limit !== undefined) {
      sqlQuery = sqlQuery.limit(limit);
    }

    if (offset !== undefined) {
      sqlQuery = sqlQuery.offset(offset);
    }

    return await sqlQuery
      .loadAllRelationIds({
        relations: ['country'],
      })
      .getManyAndCount();
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.userRepository.save({
      id: userId,
      onboardingStatus: 'FINISHED',
      ...updateProfileDto,
    });
  }

  async createUserToReview(createUserToReviewDto: CreateUserToReviewDto) {
    return this.userRepository.save({
      ...createUserToReviewDto,
      email: createUserToReviewDto.email.toLowerCase(),
      onboardingStatus: 'IN_REVIEW',
    });
  }
}
