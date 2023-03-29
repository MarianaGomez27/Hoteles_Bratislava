import { SegmentMetadata } from './segment.types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const defineActions = <T extends string>(...names: T[]): T => '' as T;

export function isSegmentEnabled(metadata: SegmentMetadata): boolean {
  return !!metadata.anonymousId || !!metadata.userId;
}
