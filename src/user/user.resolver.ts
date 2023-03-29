import { Query, Resolver, Context, Mutation, Args } from '@nestjs/graphql';
import { User } from 'src/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { name: 'user' })
  async getUser(@Context('req') req) {
    const user = await this.userService.getUser(req.id);
    return {
      ...user,
    };
  }
}
