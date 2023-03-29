import { Test } from '@nestjs/testing';
import {
  HUBSPOT_TOKEN,
  HubspotModuleOptions,
} from 'src/integrations/hubspot/hubspot.types';
import { HubSpotModule } from 'src/integrations/hubspot/hubspot.module';
import { HubSpotService } from 'src/integrations/hubspot/hubspot.service';
import { UserService } from 'src/user/user.service';
import { FeatureFlagService } from 'src/feature-flag';

describe('HubSpotModule', () => {
  const config: HubspotModuleOptions = {
    accessToken: 'accessToken',
  };

  const mockUserService = {
    provide: UserService,
    useValue: {
      getUser: jest.fn(),
    },
  };

  const mockFeatureFlagService = {
    provide: FeatureFlagService,
    useValue: {
      isFeatureEnabled: jest.fn(() => true),
    },
  };

  describe('forRootAsync', () => {
    describe('when the useFactory option is used', () => {
      it('should provide hubspot service', async () => {
        const mod = await Test.createTestingModule({
          imports: [
            HubSpotModule.forRootAsync({
              imports: [
                {
                  module: class UserModule {},
                  providers: [mockUserService],
                  exports: [mockUserService],
                },
                {
                  module: class FeatureFlagModule {},
                  providers: [mockFeatureFlagService],
                  exports: [mockFeatureFlagService],
                },
              ],
              useFactory: () => config,
            }),
          ],
        }).compile();

        const service = mod.get<HubSpotService>(HUBSPOT_TOKEN);
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(HubSpotService);
        expect(service.client.config.accessToken).toEqual(config.accessToken);
      });
    });
  });
});
