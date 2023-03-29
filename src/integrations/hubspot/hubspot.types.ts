import { ModuleMetadata, Type } from '@nestjs/common';
import { UserEntity } from 'src/user/entities';
import { UUID } from 'src/types';

export const HUBSPOT_TOKEN = 'HUBSPOT_TOKEN';

export const HUBSPOT_MODULE_OPTIONS = 'HUBSPOT_MODULE_OPTIONS';

export const HUBSPOT_EMAIL_DEFAULT_FROM = 'noreply@triptech.com';

export type HubspotModuleOptions = {
  accessToken: string;
};

export interface HubSpotOptionsFactory {
  createHubSpotOptions(): Promise<HubspotModuleOptions> | HubspotModuleOptions;
}

export interface HubSpotModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<HubSpotOptionsFactory>;
  useExisting?: Type<HubSpotOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<HubspotModuleOptions> | HubspotModuleOptions;
}

// HubSpotContactPropertyName pulls out non-functional keys from HubSpotContact
export type HubSpotContactPropertyName = {
  // Necessary to disable the next line as this is the intended behaviour and recommended approach.
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof HubSpotContact]: HubSpotContact[K] extends Function ? never : K;
}[keyof HubSpotContact];

export type HubSpotContactEventPropertyName = {
  // Necessary to disable the next line as this is the intended behaviour and recommended approach.
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof HubSpotContact]: HubSpotContact[K] extends HubSpotTimestamp
    ? K
    : never;
}[keyof HubSpotContact];

export type HubSpotContactProperty = {
  property: HubSpotContactPropertyName;
  value: string | number;
};

type HubSpotTimestamp = number;

export class HubSpotContact {
  email: string;
  firstname: string;
  fathersLastName: string;
  // address: string;
  // city: string;
  // state: string;
  // zip: string;

  static fromEntity(entity: UserEntity): HubSpotContact {
    return {
      email: entity.email,
      firstname: entity.firstName,
      fathersLastName: entity.fathersLastName,
      // address: [entity.addressLine1, entity.addressLine2]
      //   .filter(Boolean)
      //   .join(', '),
      // city: entity.town,
      // state: entity.state,
      // zip: entity.postcode,
    };
  }
}

export type UpsertContactResponse = {
  vid: number; // The HubSpot contact object ID
  isNew: boolean; // True if the upsert request created a new contact
};

export type HubSpotEmailCustomProperty = {
  name: string;
  value: string;
};

export type SendHubSpotEmailParams = {
  emailId: number;
  to: string;
  from?: string;
  customProperties?: HubSpotEmailCustomProperty[];
};

export type SendEmailResponse = {
  sendResult: string | 'SENT';
  sendingDomain: string;
  id: UUID;
  eventId: {
    id: UUID;
    created: number;
  };
};
