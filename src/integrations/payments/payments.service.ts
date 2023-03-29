import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentRequestDto } from './types';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    // TODO: Change to config service
    this.stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createPayment(paymentRequestBody: PaymentRequestDto) {
    let sumAmount = 0;
    paymentRequestBody.products.forEach((product) => {
      sumAmount = sumAmount + product.price * product.quantity;
    });
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: sumAmount * 100,
      currency: paymentRequestBody.currency,
      payment_method_types: ['card'],
    });

    return paymentIntent;
  }
}
