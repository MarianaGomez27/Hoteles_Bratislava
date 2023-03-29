import './tracer';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';

import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import { WinstonHttpInterceptor } from './winston/winston.interceptor';
import { setupCorsOrigin } from './utils/cors';
import { Logger } from '@nestjs/common';
import { WinstonLogger } from './winston/winston.logger';
import logger from './winston/loggers/main.logger';

// Raw request body is required to validate incoming webhooks from Onfido
const rawBodyBuffer = (req, res, buffer, encoding) => {
  // Only add raw body for Onfido requests
  if (!req.headers['x-sha2-signature']) {
    return;
  }

  if (buffer && buffer.length) {
    req.rawBody = buffer.toString(encoding || 'utf8');
  }
};

async function bootstrap() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    environment: process.env.DD_ENV,
  });

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: WinstonLogger.create('API'),
    abortOnError: false,
  });

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));
  app.use(bodyParser.text());
  app.useGlobalInterceptors(new WinstonHttpInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(app.getHttpAdapter()));
  app.enableCors({
    credentials: true,
    origin: setupCorsOrigin,
  });

  const httpPort = process.env.PORT || 8080;
  await app.listen(httpPort);
}

/**
 * @description
 * As we have set `abortOnError` flag to false,
 * we must handle exceptions & rejections that might
 * be thrown within the NestFactory.create method.
 *
 * Catch below is ensuring that errors that had been thrown
 * will be recorded in all Winston transports. As we're
 * dealing here with async tasks - we're closing the logger
 * manually and awaiting for `finish` even that will ensure as
 * that all logs had been write to console, or log files (Datadog uses)
 */
bootstrap().catch((error) => {
  Logger.error(error);
  Logger.flush();
  Logger.overrideLogger(false);

  logger.on('finish', () => process.exit(1));
  logger.close();
});
