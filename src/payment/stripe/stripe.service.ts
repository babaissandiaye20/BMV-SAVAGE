import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentProcessor } from '../payment-processor.interface';

@Injectable()
export class StripeService implements PaymentProcessor {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async charge(): Promise<{
    transactionId: string;
    status: 'PAID' | 'FAILED';
  }> {
    throw new Error('charge method is disabled for Stripe Checkout');
  }

  async refund(transactionId: string): Promise<boolean> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: transactionId,
      });
      return refund.status === 'succeeded';
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Refund failed: ${error.message}`);
      return false;
    }
  }

  async getTransactionDetails(
    transactionId: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(transactionId);
  }

  async createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    metadata: Record<string, string> = {},
  ): Promise<{ sessionId: string; url: string }> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: { name: 'Paiement Rendez-vous' },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata,
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }
}
