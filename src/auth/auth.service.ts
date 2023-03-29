import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Auth0UserDto } from 'src/auth/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    public userService: UserService,
    private readonly logger: Logger,
  ) {}

  public async createUserFromAuth0(
    auth0UserDto: Auth0UserDto,
  ): Promise<UserEntity> {
    const email = auth0UserDto.email;
    const existingUser = await this.userService.getUserByEmail(email);

    if (existingUser) {
      existingUser.externalId = auth0UserDto.user_id;
      existingUser.onboardingStatus = 'IN_REVIEW';
      existingUser.save();
      return existingUser;
    } else {
      const user = await this.userRepository.create({
        email: auth0UserDto.email.toLowerCase(),
        externalId: auth0UserDto.user_id,
        role: 'USER',
        onboardingStatus: 'IN_PROGRESS',
      });
      return this.userRepository.save(user);
    }
  }
}
