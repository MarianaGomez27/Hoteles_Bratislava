import { events } from './constants';

export interface SegmentMetadata {
  anonymousId?: string;
  userId?: string;
  marketingSource?: string;
  utmTags?: Record<string, string>;
}

export type EventObject = keyof typeof events;

export type EventObjectAction<O extends EventObject> = typeof events[O];

declare module 'express' {
  export interface Request {
    segment?: SegmentMetadata;
    cookies?: Record<string, string>;
  }
}
