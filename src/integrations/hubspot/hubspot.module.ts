import {
  DynamicModule,
  Global,
  Logger,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import {
  HUBSPOT_MODULE_OPTIONS,
  HUBSPOT_TOKEN,
  HubspotModuleOptions,
  HubSpotModuleAsyncOptions,
  HubSpotOptionsFactory,
} from 'src/integrations/hubspot/hubspot.types';
import { HubSpotService } from 'src/integrations/hubspot/hubspot.service';
import { UserService } from 'src/user/user.service';
import { FeatureFlagService } from 'src/feature-flag';

@Global()
@Module({})
export class HubSpotModule {
  static forRootAsync(asyncOptions: HubSpotModuleAsyncOptions): DynamicModule {
    const provider: Provider = {
      inject: [HUBSPOT_MODULE_OPTIONS, Logger, UserService, FeatureFlagService],
      provide: HUBSPOT_TOKEN,
      useFactory: (
        options: HubspotModuleOptions,
        logger: Logger,
        userService: UserService,
        featureFlagService: FeatureFlagService,
      ) => {
        return new HubSpotService(
          options,
          logger,
          userService,
          featureFlagService,
        );
      },
    };

    return {
      exports: [provider],
      imports: asyncOptions.imports,
      module: HubSpotModule,
      providers: [...this.createAsyncProviders(asyncOptions), provider, Logger],
    };
  }

  private static createAsyncProviders(
    options: HubSpotModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: HubSpotModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: HUBSPOT_MODULE_OPTIONS,
        useFactory: options.useFactory,
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<HubSpotOptionsFactory>,
    ];
    return {
      provide: HUBSPOT_MODULE_OPTIONS,
      useFactory: async (optionsFactory: HubSpotOptionsFactory) =>
        await optionsFactory.createHubSpotOptions(),
      inject,
    };
  }
}
