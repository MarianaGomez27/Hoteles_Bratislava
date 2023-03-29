import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from '@hubspot/api-client';
import { startOfDay } from 'date-fns';
import {
  HUBSPOT_EMAIL_DEFAULT_FROM,
  HUBSPOT_MODULE_OPTIONS,
  HubSpotContact,
  HubSpotContactEventPropertyName,
  HubSpotContactProperty,
  HubSpotContactPropertyName,
  HubspotModuleOptions,
  SendEmailResponse,
  SendHubSpotEmailParams,
  UpsertContactResponse,
} from 'src/integrations/hubspot/hubspot.types';
import { UserEntity } from 'src/user/entities';
import { UserService } from 'src/user/user.service';
import { UUID } from 'src/types';
import { FeatureFlagService, Features } from 'src/feature-flag';
import { IHttpOptions } from '@hubspot/api-client/lib/src/services/http/IHttpOptions';

@Injectable()
export class HubSpotService {
  readonly client: Client;

  constructor(
    @Inject(HUBSPOT_MODULE_OPTIONS)
    private readonly options: HubspotModuleOptions,
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly featureFlagService: FeatureFlagService,
  ) {
    this.client = new Client({
      accessToken: options.accessToken,
    });
  }

  private static contactToHubSpotProperties(
    contact: HubSpotContact,
  ): HubSpotContactProperty[] {
    const keys = Object.keys(contact);
    return keys.map((key: HubSpotContactPropertyName) => ({
      property: key,
      value: contact[key],
    }));
  }

  /**
   * upsertContact will create a new contact in HubSpot or update an existing contact. HubSpot will match existing
   * contacts on the email address.
   * @see https://legacydocs.hubspot.com/docs/methods/contacts/create_or_update
   */
  // async upsertContact(entity: User): Promise<UpsertContactResponse> {
  //   const contact = HubSpotContact.fromEntity(entity);
  //   if (!contact.email) {
  //     throw new Error('expected non-empty contact email address');
  //   }
  //   const properties = HubSpotService.contactToHubSpotProperties(contact);
  //   this.logger.log('hubspot: upserting contact', {
  //     email: contact.email,
  //   });
  //   return this.sendContactRequest(contact.email, properties);
  // }

  /**
   * HubSpot expects unix timestamps at midnight UTC.
   * @see https://legacydocs.hubspot.com/docs/faq/how-should-timestamps-be-formatted-for-hubspots-apis
   * @param value
   */
  static formatHubSpotTimestamp(value: Date): number {
    return startOfDay(value).setUTCHours(0, 0, 0, 0);
  }

  async getUserById(userId: UUID): Promise<UserEntity> {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new Error(`failed to find user ${userId}`);
    }
    return user;
  }

  async setEventTimestamp(
    userId: UUID,
    eventName: HubSpotContactEventPropertyName,
    timestamp: Date,
  ) {
    const user = await this.getUserById(userId);
    const property: HubSpotContactProperty = {
      property: eventName,
      value: HubSpotService.formatHubSpotTimestamp(timestamp),
    };
    return this.sendContactRequest(user.email, [property]);
  }

  async sendContactRequest(
    email: string,
    properties: HubSpotContactProperty[],
  ) {
    return await this.sendApiRequest({
      method: 'POST',
      path: `/contacts/v1/contact/createOrUpdate/email/${email}`,
      body: {
        properties,
      },
    });
  }

  // async sendEmail({
  //   to,
  //   emailId,
  //   from = HUBSPOT_EMAIL_DEFAULT_FROM,
  //   customProperties,
  // }: SendHubSpotEmailParams): Promise<SendEmailResponse> {
  //   if (!to) {
  //     throw new Error('expected non-empty to email address');
  //   }
  //   if (emailId <= 0) {
  //     throw new Error('expected valid hubspot email id');
  //   }
  //   if (!from) {
  //     throw new Error('expected non-empty from email address');
  //   }
  //   return await this.sendApiRequest({
  //     method: 'POST',
  //     path: '/email/public/v1/singleEmail/send',
  //     body: {
  //       emailId,
  //       message: {
  //         to,
  //         from,
  //       },
  //       properties: [],
  //       customProperties,
  //     },
  //   });
  // }

  /**
   * sendApiRequest will send an API request to HubSpot. Skipped if the feature flag is disabled.
   * @param requestOptions
   */
  async sendApiRequest(requestOptions: IHttpOptions) {
    const isEnabled = await this.featureFlagService.isFeatureEnabled(
      Features.INTEGRATION_HUBSPOT,
    );
    if (!isEnabled) {
      this.logger.log('hubspot integration disabled, skipping api request');
      return;
    }
    return await this.client.apiRequest(requestOptions);
  }
}
