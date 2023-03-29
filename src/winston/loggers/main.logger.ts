import { createLogger, format, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';

import nestLikeConsoleFormat from '../console.format';
import { levels } from '../winston.constants';
import { isProduction, logDirname, logFilename } from 'src/utils/environment';

const logger = createLogger({
  levels,
  exitOnError: false,
  format: format.combine(format.timestamp(), format.ms(), format.json()),
  transports: [
    new transports.Console({
      format: nestLikeConsoleFormat('API'),
      level: 'debug',
    }),
  ],
});

if (isProduction) {
  if (!existsSync(logDirname)) {
    mkdirSync(logDirname);
  }

  logger.add(
    new transports.File({
      eol: '\n',
      filename: logFilename,
      level: 'verbose',
    }),
  );
}

export default logger;
