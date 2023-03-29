import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { SegmentMetadata } from '../segment.types';

/**
 * @description
 * Parameter decorator that extracts segment identifier from the request.
 * @param {keyof SegmentMetadata | undefined} propertyKey
 */
export const Segment = createParamDecorator<keyof SegmentMetadata | undefined>(
  (propertyKey: keyof SegmentMetadata, context: GqlExecutionContext) => {
    const contextType = context.getType();
    if (contextType === 'graphql') {
      const { req: request } = context.getArgByIndex(2);
      const { segment } = request as Request;
      return propertyKey ? segment[propertyKey] : segment;
    }

    const http = context.switchToHttp();
    const { segment } = http.getRequest<Request>();
    return propertyKey ? segment[propertyKey] : segment;
  },
);
