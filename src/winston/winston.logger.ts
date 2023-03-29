import { LoggerService } from '@nestjs/common';
import { Logger } from 'winston';

import logger from './loggers/main.logger';
import { LogLevel } from './winston.types';

export type ObjectLog = {
  message: string;
  [key: string]: any;
};

export class WinstonLogger implements LoggerService {
  readonly logger = logger;

  static create(context?: string) {
    return new WinstonLogger(context);
  }

  constructor(readonly context?: string) {}

  error(message: any, trace?: string, context?: string): Logger {
    context = context || this.context;

    if (message instanceof Error) {
      const { message: msg, name, ...meta } = message;

      delete meta['stack'];

      return this.logger.error(msg, {
        errorName: name,
        context,
        stack: [trace || message.stack],
        ...meta,
      });
    }

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.error(msg as string, {
        context,
        stack: [trace],
        ...meta,
      });
    }

    return this.logger.error(message, { context, stack: [trace] });
  }

  log(message: ObjectLog | string, context?: string): Logger {
    return this.logLevel('info', message, context);
  }

  warn(message: ObjectLog | string, context?: string): any {
    return this.logLevel('verbose', message, context);
  }

  debug(message: ObjectLog | string, context?: string): Logger {
    return this.logLevel('debug', message, context);
  }

  verbose(message: ObjectLog | string, context?: string): Logger {
    return this.logLevel('verbose', message, context);
  }

  logLevel(
    level: LogLevel,
    message: ObjectLog | string,
    context?: string,
  ): Logger {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger[level](msg as string, { context, ...meta });
    }

    return this.logger[level](message, { context });
  }
}
