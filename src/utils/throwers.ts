export interface ThrowerExceptionMetadata<T extends object = object> {
  type: string;
  message: string;
  metadata: T;
}

export function createExceptionMetadata<T extends object = object>(
  type: string,
  message: string,
  metadata?: T,
): ThrowerExceptionMetadata {
  const defaultMetadata = {};

  return {
    type,
    message: `${message}`,
    metadata: {
      ...defaultMetadata,
      ...(metadata || {}),
    },
  };
}
