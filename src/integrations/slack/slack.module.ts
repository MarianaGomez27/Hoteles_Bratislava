import { Global, Logger, Module } from '@nestjs/common';
import { SlackService } from './slack.service';

@Global()
@Module({
  imports: [],
  providers: [SlackService, Logger],
  exports: [SlackService],
})
export class SlackModule {}
