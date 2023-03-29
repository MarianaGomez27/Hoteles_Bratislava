import { BadRequestException } from '@nestjs/common';
import { createExceptionMetadata } from 'src/utils/throwers';

export function throwOrderLimitExceeded(limit) {
  throw new BadRequestException(
    createExceptionMetadata(
      'OrderLimitExceeded',
      `Order should not exceed ${limit} of the available amount`,
      {
        limit,
      },
    ),
  );
}
