import { Test, TestingModule } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { InjectHubSpot } from 'src/integrations/hubspot/hubspot.decorator';
import { HubSpotService } from 'src/integrations/hubspot/hubspot.service';
import { HubSpotModule } from 'src/integrations/hubspot/hubspot.module';
import { users } from 'src/test/fixtures/user.fixture';
import { UpsertContactResponse } from 'src/integrations/hubspot/hubspot.types';
import { UserService } from 'src/user/user.service';
import { FeatureFlagService } from 'src/feature-flag';
import { mockHubSpotConfig } from 'src/test/fixtures/hubspot.fixture';

describe('InjectHubSpot', () => {
  let module: TestingModule;
  const config = mockHubSpotConfig;

  @Injectable()
  class InjectableService {
    public constructor(
      @InjectHubSpot() public readonly service: HubSpotService,
    ) {}
  }

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

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [InjectableService],
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
  });

  describe('when decorating a class constructor parameter', () => {
    it('should inject the hubspot service', () => {
      const testService = module.get(InjectableService);
      expect(testService).toHaveProperty('service');
      expect(testService.service).toBeInstanceOf(HubSpotService);
    });
  });

  describe('when calling upsertContact', () => {
    it('should send the upsert contact request', async () => {
      const testService = module.get(InjectableService);
      const mockApiResponse: UpsertContactResponse = {
        isNew: true,
        vid: 1234,
      };
      jest
        .spyOn(testService.service.client, 'apiRequest')
        .mockImplementation(() => Promise.resolve(mockApiResponse));
      const response = await testService.service.upsertContact(users.normal);
      expect(response).toBeDefined();
      expect(response.vid).toEqual(mockApiResponse.vid);
      expect(response.isNew).toEqual(mockApiResponse.isNew);
    });
  });
});
