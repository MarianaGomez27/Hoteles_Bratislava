import * as path from 'path';
import * as process from 'process';

const { env } = process;

export const rootDir = path.resolve(__dirname, '../..');

export const sourceDir = path.resolve(rootDir, 'src');

export const logDirname = path.resolve(env.APP_LOG_DIRNAME || '');

export const logFilename = path.resolve(env.APP_LOG_FILENAME || '');

export const isProduction = ['production', 'prod'].includes(
  env.NODE_ENV?.toLowerCase(),
);

export const isDevelopment = !isProduction;
