import { ConfigService } from '@nestjs/config';
import { isDevelopment } from 'src/utils/environment';

export const ANALYTICS = Symbol('segment:analytics');

export default {
  provide: ANALYTICS,
  useFactory: async (config) => {
    const Analytics = await import('analytics-node');

    return new Analytics(
      isDevelopment ? 'no api key' : config.get('segment.writeKey'),
    );
  },
  inject: [ConfigService],
};
