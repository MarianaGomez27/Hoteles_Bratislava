import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { IHttpOptions } from '@hubspot/api-client/lib/src/services/http/IHttpOptions';
import { HubSpotService } from 'src/integrations/hubspot/hubspot.service';
import {
  HUBSPOT_MODULE_OPTIONS,
  SendEmailResponse,
  SendHubSpotEmailParams,
  UpsertContactResponse,
} from 'src/integrations/hubspot/hubspot.types';
import { users } from 'src/test/fixtures/user.fixture';
import { UserService } from 'src/user/user.service';
import { FeatureFlagService } from 'src/feature-flag';
import { mockHubSpotConfig } from 'src/test/fixtures/hubspot.fixture';

describe('HubSpotService', () => {
  let hubSpotService: HubSpotService;
  let featureFlagService: FeatureFlagService;
  const config = mockHubSpotConfig;

  const getMockIsFeatureEnabled = () => jest.fn(() => true);
  let mockIsFeatureEnabled: ReturnType<typeof getMockIsFeatureEnabled>;

  beforeEach(async () => {
    mockIsFeatureEnabled = getMockIsFeatureEnabled();

    const module = await Test.createTestingModule({
      providers: [
        HubSpotService,
        {
          provide: HUBSPOT_MODULE_OPTIONS,
          useValue: {
            accessToken: config.accessToken,
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(),
          },
        },
        {
          provide: FeatureFlagService,
          useValue: {
            isFeatureEnabled: mockIsFeatureEnabled,
          },
        },
      ],
    }).compile();
    hubSpotService = module.get(HubSpotService);
    featureFlagService = module.get(FeatureFlagService);
  });

  describe('when the hubspot feature is off', () => {
    beforeEach(() => {
      jest
        .spyOn(featureFlagService, 'isFeatureEnabled')
        .mockImplementation(async () => false);
    });

    it('should not run the controller and print a log', async () => {
      const apiRequest = jest.fn();
      jest
        .spyOn(hubSpotService.client, 'apiRequest')
        .mockImplementation(apiRequest);
      await hubSpotService.sendContactRequest('user@example.com', []);
      expect(apiRequest).not.toHaveBeenCalled();
    });
  });

  describe('upsertContact', () => {
    describe('with invalid arguments', () => {
      it('should throw an error if the email is empty', async () => {
        expect.assertions(1);
        try {
          await hubSpotService.upsertContact({ ...users.normal, email: '' });
        } catch (err) {
          expect(err.message).toEqual(
            'expected non-empty contact email address',
          );
        }
      });
    });
    describe('with valid arguments', () => {
      it('should send the upsert contact request', async () => {
        const mockApiResponse: UpsertContactResponse = {
          isNew: true,
          vid: 1234,
        };
        jest
          .spyOn(hubSpotService.client, 'apiRequest')
          .mockImplementation(() => Promise.resolve(mockApiResponse));
        const response = await hubSpotService.upsertContact(users.normal);
        expect(response).toBeDefined();
        expect(response.vid).toEqual(mockApiResponse.vid);
        expect(response.isNew).toEqual(mockApiResponse.isNew);
      });
      it('should throw an error if hubspot API request fails', async () => {
        const mockError = new Error('error');
        jest
          .spyOn(hubSpotService.client, 'apiRequest')
          .mockImplementation(() => Promise.reject(mockError));

        expect.assertions(1);
        try {
          await hubSpotService.upsertContact(users.normal);
        } catch (err) {
          expect(err).toEqual(mockError);
        }
      });
    });
  });

  describe('sendEmail', () => {
    let mockValidSendEmailParams: SendHubSpotEmailParams;
    beforeEach(() => {
      mockValidSendEmailParams = {
        from: 'from',
        to: 'to',
        emailId: 1,
      };
    });

    describe('with invalid arguments', () => {
      it('should throw an error if the to email is empty', async () => {
        expect.assertions(1);
        try {
          await hubSpotService.sendEmail({
            ...mockValidSendEmailParams,
            to: '',
          });
        } catch (err) {
          expect(err.message).toEqual('expected non-empty to email address');
        }
      });
      it('should throw an error if the hubspot emailId is 0', async () => {
        expect.assertions(1);
        try {
          await hubSpotService.sendEmail({
            ...mockValidSendEmailParams,
            emailId: 0,
          });
        } catch (err) {
          expect(err.message).toEqual('expected valid hubspot email id');
        }
      });
      it('should throw an error if the hubspot emailId is less than 0', async () => {
        expect.assertions(1);
        try {
          await hubSpotService.sendEmail({
            ...mockValidSendEmailParams,
            emailId: -1,
          });
        } catch (err) {
          expect(err.message).toEqual('expected valid hubspot email id');
        }
      });
      it('should throw an error if the from email is empty', async () => {
        expect.assertions(1);
        try {
          await hubSpotService.sendEmail({
            ...mockValidSendEmailParams,
            from: '',
          });
        } catch (err) {
          expect(err.message).toEqual('expected non-empty from email address');
        }
      });
    });
    describe('with valid arguments', () => {
      it('should send the email request', async () => {
        const mockEmailResponse: SendEmailResponse = {
          sendResult: 'SENT',
          id: 'id',
          eventId: { created: 123, id: 'id' },
          sendingDomain: 'sendingDomain',
        };
        let httpOptions: IHttpOptions;
        const mockApiRequestFn = jest.fn((options) => {
          httpOptions = options;
          return Promise.resolve(mockEmailResponse);
        });
        jest
          .spyOn(hubSpotService.client, 'apiRequest')
          .mockImplementation(mockApiRequestFn);
        const response = await hubSpotService.sendEmail(
          mockValidSendEmailParams,
        );
        expect(response).toBeDefined();
        expect(mockApiRequestFn).toHaveBeenCalled();
        expect(httpOptions).toBeDefined();
        expect(httpOptions.method).toEqual('POST');
        expect(httpOptions.path).toEqual('/email/public/v1/singleEmail/send');
        expect(httpOptions.body).toBeDefined();
        expect(httpOptions.body).toEqual({
          emailId: httpOptions.body.emailId,
          message: {
            to: httpOptions.body.message?.to,
            from: httpOptions.body.message?.from,
          },
          properties: [],
        });
        expect(response.sendResult).toEqual('SENT');
      });
      it('should throw an error if hubspot API request fails', async () => {
        const mockError = new Error('error');
        jest
          .spyOn(hubSpotService.client, 'apiRequest')
          .mockImplementation(() => Promise.reject(mockError));

        expect.assertions(1);
        try {
          await hubSpotService.sendEmail(mockValidSendEmailParams);
        } catch (err) {
          expect(err).toEqual(mockError);
        }
      });
    });
  });
});
