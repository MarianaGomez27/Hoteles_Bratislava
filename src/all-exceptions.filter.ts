/* eslint-disable */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpServer,
  HttpStatus,
  Inject,
  Logger,
  Optional,
} from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { AbstractHttpAdapter } from '@nestjs/core';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import * as Sentry from '@sentry/node';

export class AllExceptionsFilter<T = any>
  implements ExceptionFilter<T>, GqlExceptionFilter<T>
{
  private static readonly logger = new Logger('ExceptionsHandler');

  @Optional()
  @Inject()
  protected readonly httpAdapterHost?: HttpAdapterHost;

  constructor(protected readonly applicationRef?: HttpServer) {}

  catch(exception: T, host: ArgumentsHost) {
    Sentry.captureException(exception);
    let response = host.getArgByIndex(1);
    // Handle REST petitions first
    // These are the ones where we can get the request object from the underlying http adapter
    if (response && response.status) {
      return this.handleRestError(exception, host);
    }
    // Handle non rest and graphql exceptions
    // These are the ones where the request cannot be found in the underlying http adapter
    else {
      return this.handleGqlError(exception, host);
    }
  }

  private handleUnknownError(
    exception: T,
    host: ArgumentsHost,
    applicationRef: AbstractHttpAdapter | HttpServer,
  ) {
    const body = this.isHttpError(exception)
      ? {
          statusCode: exception.statusCode,
          message: exception.message,
        }
      : {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
    applicationRef.reply(host.getArgByIndex(1), body, body.statusCode);

    if (this.isExceptionObject(exception)) {
      return AllExceptionsFilter.logger.error(
        exception.message,
        exception.stack,
      );
    }
    return AllExceptionsFilter.logger.error(exception);
  }

  private isExceptionObject(err: any): err is Error {
    return isObject(err) && !!(err as Error).message;
  }

  private isHttpError(
    err: any,
  ): err is { statusCode: number; message: string } {
    return err?.statusCode && err?.message;
  }

  private handleRestError(exception: T, host: ArgumentsHost) {
    let request = host.getArgByIndex(0);

    const applicationRef =
      this.applicationRef ||
      (this.httpAdapterHost && this.httpAdapterHost.httpAdapter);

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const message = isObject(exceptionResponse)
        ? exceptionResponse
        : {
            statusCode: exception.getStatus(),
            message: exceptionResponse,
            path: request.url,
            method: request.method,
            timestamp: new Date().toLocaleString(),
          };
      applicationRef.reply(
        host.getArgByIndex(1),
        message,
        exception.getStatus(),
      );
    } else {
      // Here is a good place to handle custom exceptions
      return this.handleUnknownError(exception, host, applicationRef);
    }
  }

  private handleGqlError(exception: T, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const gqlInfo = gqlHost.getInfo<GraphQLResolveInfo>();

    const status =
      exception instanceof HttpException && exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      isError: true,
      statusCode: status,
      timestamp: new Date().toLocaleString(),
      type: gqlInfo.parentType,
      field: gqlInfo.fieldName,
      error: JSON.stringify(exception),
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      AllExceptionsFilter.logger.error(errorResponse);
    }

    return exception;
  }
}
