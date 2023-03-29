import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as flagsmith from 'flagsmith-nodejs';
import { DEFAULT_FEATURE_FLAGS } from './feature-flag.constants';
import { Features } from './feature-flag.types';

@Injectable()
export class FeatureFlagService {
  private readonly logger = new Logger(FeatureFlagService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('FEATURE_TOGGLE_ID');

    flagsmith.init({
      environmentID: apiKey,
    });
  }

  async isFeatureEnabled(feature: Features): Promise<boolean> {
    let value: boolean;

    try {
      value = await flagsmith.hasFeature(feature);
    } catch (err) {
      this.logger.error('Failed to check feature from flagsmith', {
        errorMessage: err?.message ?? 'Something went wrong',
      });

      // If we fail to get feature flag from provider — we use custom default value.
      // Features might have different default values as they have different impact
      // so it makes sense to have more control over the default
      value = DEFAULT_FEATURE_FLAGS[feature];
    }

    return value;
  }

  async getFeature(feature: Features): Promise<{
    isEnabled: boolean;
    value: unknown;
  }> {
    const isEnabled = await this.isFeatureEnabled(feature);
    const value = await flagsmith.getValue(feature);

    const payload = {
      isEnabled,
      value,
    };

    switch (feature) {
      case Features.WHITELIST: {
        payload.value = typeof value === 'string' ? JSON.parse(value) : value;
        return payload;
      }
      default: {
        return payload;
      }
    }
  }
}
