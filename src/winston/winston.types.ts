import { HttpStatus } from '@nestjs/common';

export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug';

export interface RequestHttpMetadata {
  method:
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';
  statusCode: HttpStatus;
  ip: string | null;
  hostname: string | null;
  userAgent: string;
}

export interface RequestHandlerMetadata {
  contextType: string;
  className: string;
  methodName: string;
}

export interface RequestErrorMetadata {
  name: string;
  message: string;
}

export interface RequestLog {
  request: RequestHttpMetadata;
  handler: RequestHandlerMetadata;
  error: RequestErrorMetadata | object;
  message: string;
}
