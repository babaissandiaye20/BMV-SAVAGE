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

  /**
   * Stripe Checkout workflow : pas de "charge" direct.
   */
  async charge(
    amount?: number,
    currency?: string,
    paymentDetails?: any,
  ): Promise<{
    transactionId: string;
    status: 'PAID' | 'FAILED';
  }> {
    throw new Error('charge method is disabled for Stripe Checkout');
  }

  /**
   * Refund d'une transaction Stripe Checkout.
   * @param transactionId l'id de PaymentIntent ou Checkout Session
   */
  async refund(transactionId: string): Promise<boolean> {
    try {
      // On tente avec l'id comme payment_intent (Stripe PaymentIntent ID)
      const refund = await this.stripe.refunds.create({
        payment_intent: transactionId,
      });
      return refund.status === 'succeeded';
    } catch (error) {
      this.logger.error(`Refund failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Récupération d'une session Checkout Stripe.
   * @param transactionId id de la session Checkout (ex: cs_test_xxx)
   */
  async getTransactionDetails(
    transactionId: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(transactionId);
  }

  /**
   * Crée une session Checkout Stripe pour paiement.
   */
  async createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    metadata: Record<string, string> = {},
  ): Promise<{ sessionId: string; url: string }> {
    // Stripe exige les montants en CENTIMES (ex: 5€ = 500)
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100), // Stripe = centimes
            product_data: { name: 'Paiement Rendez-vous' },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata, // { userId, appointmentIds, etc. }
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }
}
