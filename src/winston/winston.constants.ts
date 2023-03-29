import * as clc from 'cli-color';
import * as bare from 'cli-color/bare';

import { LogLevel } from './winston.types';

/**
 * Each level has its own colour assigned
 */
export const colors: Record<LogLevel, bare.Format> = {
  info: clc.greenBright,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};

/**
 * Levels sorted by priority
 */
export const levels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
};
