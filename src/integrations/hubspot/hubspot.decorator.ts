import { Inject } from '@nestjs/common';
import { HUBSPOT_TOKEN } from 'src/integrations/hubspot/hubspot.types';

export function InjectHubSpot() {
  return Inject(HUBSPOT_TOKEN);
}
