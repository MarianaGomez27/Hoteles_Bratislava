import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserEntity } from 'src/user/entities/user.entity';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export type UserParamInput = keyof UserEntity;

export const User = createParamDecorator(
  (propertyKey: UserParamInput, ctx: GqlExecutionContext) => {
    const contextType = ctx.getType();
    if (contextType === 'graphql') {
      const { req: request } = ctx.getArgByIndex(2);
      const { user } = request;
      return propertyKey ? user?.[propertyKey] : user;
    }

    const http = ctx.switchToHttp();
    const { user } = http.getRequest();
    return propertyKey ? user?.[propertyKey] : user;
  },
);