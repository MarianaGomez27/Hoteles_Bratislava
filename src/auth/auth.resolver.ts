import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { AnalyticsService, Segment, SegmentMetadata } from 'src/analytics';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    // private analytics: AnalyticsService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
  }
}
