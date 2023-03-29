import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  readonly logger = new Logger('JwtStrategy');

  constructor(private userService: UserService) {
    super({
      passReqToCallback: true,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],
    });
  }

  // validate(request: unknown, payload: any, done: (arg1, arg2) => unknown): unknown {
  async validate(request: unknown, payload: any): Promise<unknown> {
    this.logger.log(`Getting token permissions for ${payload.sub}`);
    const user = await this.userService.getUserByAuth0Id(payload.sub);

    if (user) {
      return {
        profile: user,
        token: payload,
      };
    }

    this.logger.warn(`No user found with ${payload.sub}`);
    throw new UnauthorizedException(
      `Could not get JWT permissions for user ${payload.sub}`,
    );
  }
}
