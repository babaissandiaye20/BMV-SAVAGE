import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentProcessor } from '../payment-processor.interface';


@Injectable()
export class StripeService implements PaymentProcessor {
  // @ts-ignore
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  // @ts-ignore
  async charge(amount: number, currency: string, paymentDetails: any) {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        payment_method: paymentDetails.paymentMethodId,
        confirm: true,
      });
      return { transactionId: intent.id, status: 'PAID' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { transactionId: '', status: 'FAILED' };
    }
  }

  async refund(transactionId: string) {
    const refund = await this.stripe.refunds.create({ payment_intent: transactionId });
    return refund.status === 'succeeded';
  }

  async getTransactionDetails(transactionId: string) {
    return this.stripe.paymentIntents.retrieve(transactionId);
  }
}
