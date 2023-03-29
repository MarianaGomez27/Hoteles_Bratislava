import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from 'src/graphql';
import { createExceptionMetadata } from 'src/utils/throwers';

export function throwOrderInvalidStatus(statusType: OrderStatus) {
  throw new BadRequestException(
    createExceptionMetadata(
      'OrderInvalidStatus',
      `Could not process order in "${statusType}" status`,
      {
        currentStatus: statusType,
      },
    ),
  );
}
