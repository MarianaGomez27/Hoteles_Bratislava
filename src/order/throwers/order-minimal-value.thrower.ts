import { BadRequestException } from '@nestjs/common';
import { createExceptionMetadata } from 'src/utils/throwers';

export function throwOrderMinimalValue(limit: number) {
  throw new BadRequestException(
    createExceptionMetadata(
      'OrderMinimalValue',
      `Order's value must be greater or equal ${limit}`,
      {
        limit,
      },
    ),
  );
}
