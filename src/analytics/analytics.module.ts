import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import analyticsProvider from './analytics.provider';
import { AnalyticsService } from './analytics.service';
import { SegmentMiddleware } from './segment.middleware';

@Global()
@Module({
  providers: [analyticsProvider, AnalyticsService],
  exports: [AnalyticsService],
})
export class SegmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SegmentMiddleware).forRoutes('*');
  }
}
