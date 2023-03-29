import {
  CallHandler,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';
import { WinstonLogger } from './winston.logger';
import { RequestLog } from './winston.types';

const INTERNAL_ERROR_STATUS_CODE_REGEX = /^5[0-9]{2}$/;

@Injectable({
  scope: Scope.REQUEST,
})
export class WinstonHttpInterceptor implements NestInterceptor {
  readonly logger = new WinstonLogger('HTTP');
  readonly ignoreHandlers = [
    { className: 'AppController', methodName: 'getHello' },
  ];

  intercept(
    context: GqlExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap({
        next: () => this.report(context),
        error: (error) => this.report(context, error),
      }),
    );
  }

  private report(context: GqlExecutionContext, exceptionOrError?: any) {
    const { name: className } = context.getClass();
    const { name: methodName } = context.getHandler();

    const isIgnored = this.ignoreHandlers.some(
      (handler) =>
        handler.className === className && handler.methodName === methodName,
    );
    if (isIgnored) return;

    const request = this.getRequest(context);
    if (!request) return;
    const response = this.getResponse(context);
    if (!response) return;

    const { method, hostname, ip } = request;
    const { statusCode } = response;
    const headers = this.getHeaders(request.rawHeaders);

    const metadata: RequestLog = {
      request: {
        method,
        statusCode,
        ip,
        hostname,
        userAgent: headers['User-Agent'],
      },
      handler: {
        contextType: context.getType(),
        className,
        methodName,
      },
      message: null,
      error: {},
    };

    if (exceptionOrError) {
      metadata.request.statusCode =
        exceptionOrError instanceof HttpException
          ? exceptionOrError.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      metadata.error = {
        ...exceptionOrError,
        name: exceptionOrError.name,
        message: exceptionOrError.message,
      };
    }

    metadata.message = this.formatMessage(metadata);
    const level = INTERNAL_ERROR_STATUS_CODE_REGEX.test(`${statusCode}`)
      ? 'error'
      : 'verbose';
    this.logger.logLevel(level, metadata);
  }

  private formatMessage(metadata: RequestLog): string {
    const {
      request: { method, statusCode, ip, hostname },
      handler: { className, methodName },
    } = metadata;
    const hostName = ip || hostname;

    return `[${method}/${statusCode}] ${className}#${methodName} called by ${hostName}`;
  }

  private getHeaders(rawHeaders: string[]): Record<string, string> {
    const acc = {};
    for (let index = 0; index < rawHeaders.length; index += 2) {
      const key = rawHeaders[index];
      const value = rawHeaders[index + 1];
      acc[key] = value;
    }
    return acc;
  }

  private getRequest(context: GqlExecutionContext) {
    if (context.getType() === 'graphql') {
      const { req: request } = context.getArgByIndex(2);
      return request;
    }
    return context.switchToHttp().getRequest();
  }

  private getResponse(context: GqlExecutionContext) {
    const request = this.getRequest(context);

    return request.res;
  }
}
