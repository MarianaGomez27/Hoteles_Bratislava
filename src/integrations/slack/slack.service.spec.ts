import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SlackService, TEST_CHANNEL } from './slack.service';

const sampleBlockMessage = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>',
    },
  },
  {
    type: 'section',
    fields: [
      {
        type: 'plain_text',
        text: '*this is plain_text text*',
        emoji: true,
      },
    ],
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'Test block with users select',
    },
    accessory: {
      type: 'users_select',
      placeholder: {
        type: 'plain_text',
        text: 'Select a user',
        emoji: true,
      },
      action_id: 'users_select-action',
    },
  },
];

const testMessage = 'This is a test message';

describe('SlackService', () => {
  let slackService: SlackService;

  const mockConfig = {
    get: (key: 'slack') => {
      switch (key) {
        case 'slack':
          return {
            botToken: '123',
          };
        default:
          return {};
      }
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SlackService,
        { provide: ConfigService, useValue: mockConfig },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    }).compile();
    slackService = moduleRef.get(SlackService);
  });

  describe('Function -> sendTextMessage', () => {
    afterEach(() => jest.resetAllMocks());

    it('should send a message to the test channel if none is indicated', async () => {
      const chatFunc = slackService.slackClient.chat;
      jest.spyOn(chatFunc, 'postMessage').mockImplementation(jest.fn());

      await slackService.sendTextMessage({
        message: testMessage,
      });

      expect(chatFunc.postMessage).toHaveBeenCalledWith({
        text: testMessage,
        channel: TEST_CHANNEL,
      });
    });

    it('should override the channel in a test environment', async () => {
      const chatFunc = slackService.slackClient.chat;
      jest.spyOn(chatFunc, 'postMessage').mockImplementation(jest.fn());

      await slackService.sendTextMessage({
        message: testMessage,
        channel: 'magic-channel',
      });

      expect(chatFunc.postMessage).toHaveBeenCalledWith({
        text: testMessage,
        channel: TEST_CHANNEL,
      });
    });
  });

  describe('Function -> sendBlockMessage', () => {
    afterEach(() => jest.resetAllMocks());

    it('should override the channel in a test environment', async () => {
      const chatFunc = slackService.slackClient.chat;
      jest.spyOn(chatFunc, 'postMessage').mockImplementation(jest.fn());

      await slackService.sendBlockMessage({
        blocks: sampleBlockMessage,
        pushNotificationText: testMessage,
        channel: 'breakfast-channel',
      });

      expect(chatFunc.postMessage).toHaveBeenCalledWith({
        text: testMessage,
        blocks: sampleBlockMessage,
        channel: TEST_CHANNEL,
      });
    });

    it('should send a block message to the test channel if none is indicated', async () => {
      const chatFunc = slackService.slackClient.chat;
      jest.spyOn(chatFunc, 'postMessage').mockImplementation(jest.fn());

      await slackService.sendBlockMessage({
        blocks: sampleBlockMessage,
        pushNotificationText: testMessage,
      });

      expect(chatFunc.postMessage).toHaveBeenCalledWith({
        text: testMessage,
        blocks: sampleBlockMessage,
        channel: TEST_CHANNEL,
      });
    });
  });
});
