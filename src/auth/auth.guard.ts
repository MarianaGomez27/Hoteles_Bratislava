import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { AuthGuard as JwtAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends JwtAuthGuard('jwt') {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private reflector: Reflector, private userService: UserService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // const routePermissions = this.reflector.get<string[]>(
    //   'permissions',
    //   context.getHandler(),
    // );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
