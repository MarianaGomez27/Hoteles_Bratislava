import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { createSecretKey, KeyObject } from 'crypto';
import { ConfigService } from '@nestjs/config';
// import { AnalyticsService, Segment, SegmentMetadata } from 'src/analytics';
import { BookingService } from './booking.service';

@Resolver('Auth')
export class BookingResolver {
  constructor(
    private bookingService: BookingService,
    // private analytics: AnalyticsService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}
}
