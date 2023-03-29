import { BadRequestException } from '@nestjs/common';
import { createExceptionMetadata } from 'src/utils/throwers';

export function throwOrderMaximalQuantity(limit: number) {
  throw new BadRequestException(
    createExceptionMetadata(
      'OrderMaximalQuantity',
      `Order's quantity must be less or equal ${limit}`,
      {
        limit,
      },
    ),
  );
}
