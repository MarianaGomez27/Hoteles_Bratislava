import { Injectable, Logger } from '@nestjs/common';
import { WebClient as SlackClient } from '@slack/web-api';
import { ConfigService } from '@nestjs/config';
import { SlackConfig, ConfigVariables } from 'src/config/configuration';
import { isDevelopment } from 'src/utils/environment';
import { KnownBlock, Block } from '@slack/types';

export const TEST_CHANNEL = 'slack-bot-testing';

@Injectable()
export class SlackService {
  private readonly config: SlackConfig;
  public readonly slackClient: SlackClient;

  constructor(
    private readonly configService: ConfigService<ConfigVariables>,
    private readonly logger: Logger,
  ) {
    this.config = configService.get<SlackConfig>('slack');
    this.slackClient = new SlackClient(this.config.botToken);
  }

  private getChannel(channelName?: string): string {
    // We can alternatively use another slack workspace, but this is good for now.

    if (!channelName || isDevelopment) {
      return TEST_CHANNEL;
    }
    return channelName;
  }

  async sendTextMessage({
    message,
    channel,
  }: {
    message: string;
    channel?: string;
  }) {
    try {
      return await this.slackClient.chat.postMessage({
        channel: this.getChannel(channel),
        text: message,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  // A good read in case you want to use blocks: https://api.slack.com/block-kit/building
  // Easiest way to create a block: https://app.slack.com/block-kit-builder/
  async sendBlockMessage({
    blocks,
    pushNotificationText,
    channel,
  }: {
    blocks: (Block | KnownBlock)[];
    pushNotificationText: string;
    channel?: string;
  }): Promise<void> {
    try {
      await this.slackClient.chat.postMessage({
        channel: this.getChannel(channel),
        text: pushNotificationText || '',
        blocks: blocks,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
