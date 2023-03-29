import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentRequestDto } from './types';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post()
  public async createPayments(@Body() paymentRequestDto: PaymentRequestDto) {
    const result = await this.paymentService.createPayment(paymentRequestDto);
    return result;
  }
}
