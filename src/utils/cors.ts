type NextFunction = (error: Error, origin: string) => unknown;

export function setupCorsOrigin(origin: string, next: NextFunction): unknown {
  return next(undefined, origin);
}
