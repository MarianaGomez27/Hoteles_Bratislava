import { NextFunction, Request, Response } from 'express';
import {
  anonymousIdKey,
  userIdKey,
  marketingSourceKey,
} from './segment.constants';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class SegmentMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { cookies } = request;
    const keys = Object.keys(cookies);
    const utmKeys = keys.filter((key) => key.startsWith('utm_'));
    const utmTags = {};

    utmKeys.forEach((key) => {
      utmTags[key] = cookies[key];
    });

    request.segment = {
      anonymousId: cookies[anonymousIdKey],
      userId: cookies[userIdKey],
      marketingSource: cookies[marketingSourceKey],
      utmTags,
    };

    next();
  }
}
