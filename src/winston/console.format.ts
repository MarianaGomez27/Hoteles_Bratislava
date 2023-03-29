import { Format } from 'logform';
import { format } from 'winston';

import * as clc from 'cli-color';
import { colors } from './winston.constants';
import { pid } from 'process';
import { format as formatDate } from 'date-fns';

export default function nestLikeConsoleFormat(name = 'Nest'): Format {
  return format.printf(
    ({ context, level, timestamp, message, ms, ...metadata }) => {
      const color = colors[level] || ((rawText) => rawText);

      const nameField = name;
      const levelField = level.toUpperCase();
      const timestampField = clc.whiteBright(
        formatDate(
          new Date(timestamp ? timestamp : Date.now()),
          'dd/MM/yyyy, h:mm:ss a',
        ),
      );
      const contextField = clc.yellow('[' + (context || 'Unknown') + ']');
      const messageField = message;
      const metadataField =
        typeof metadata === 'object'
          ? '- ' + JSON.stringify(metadata)
          : metadata
          ? metadata
          : '';
      const msField = ms ? ' ' + clc.yellow(ms) : '';

      return color(
        `[${nameField}] ${pid}  - ${timestampField}\t${levelField} ${contextField} ${messageField} ${metadataField} ${msField}`,
      );
    },
  );
}
