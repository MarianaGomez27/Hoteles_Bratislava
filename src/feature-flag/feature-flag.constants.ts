import { Features } from './feature-flag.types';

type DefaultFeatureFlagsType = { [flag in Features]: boolean };

export const DEFAULT_FEATURE_FLAGS: DefaultFeatureFlagsType = {
  [Features.WHITELIST]: true,
  /**
   * The HubSpot integration is disabled by default.
   */
  [Features.INTEGRATION_HUBSPOT]: false,
};
