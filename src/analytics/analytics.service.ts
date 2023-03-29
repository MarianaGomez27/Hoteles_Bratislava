import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Analytics from 'analytics-node';

import {
  EventObject,
  EventObjectAction,
  SegmentMetadata,
} from './segment.types';
import { ANALYTICS } from './analytics.provider';
import { isDevelopment } from '../utils/environment';
import { isSegmentEnabled } from './analytics.helpers';

@Injectable()
export class AnalyticsService {
  readonly logger = new Logger('Analytics');
  constructor(
    @Inject(ANALYTICS) readonly analytics: Analytics,
    readonly config: ConfigService,
  ) {}

  private defaultProperties = {
    source: 'api',
    environment: this.config.get('segment.environment'),
  };

  async track<O extends EventObject, OA extends EventObjectAction<O>>(
    objectName: O,
    actionName: OA,
    metadata: SegmentMetadata,
    properties: object = {},
  ) {
    if (isDevelopment) return;
    if (!isSegmentEnabled(metadata)) return;

    const utmTags = metadata.utmTags || {};

    try {
      this.analytics.track({
        userId: metadata.userId,
        anonymousId: metadata.anonymousId,
        event: `${objectName} ${actionName}`,
        timestamp: new Date(),
        properties: {
          ...this.defaultProperties,
          ...properties,
          ...utmTags,
          marketingSource: metadata.marketingSource,
        },
      });
    } catch (error) {
      this.logger.verbose(
        {
          message: error.message,
          error,
        },
        'Analytics',
      );
    }
  }

  async identify(metadata: SegmentMetadata, traits: object = {}) {
    if (isDevelopment) return;
    if (!isSegmentEnabled(metadata)) return;

    try {
      this.analytics.identify({
        userId: metadata.userId,
        anonymousId: metadata.anonymousId,
        traits: { ...traits, ...this.defaultProperties },
      });
    } catch (error) {
      this.logger.verbose(
        {
          message: error.message,
          error,
        },
        'Analytics',
      );
    }
  }
}
