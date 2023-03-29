import { BadRequestException } from '@nestjs/common';
import { createExceptionMetadata } from 'src/utils/throwers';

export function throwOrderNotFound() {
  throw new BadRequestException(
    createExceptionMetadata('OrderNotFound', `Could not find matching Order`),
  );
}
