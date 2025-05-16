import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { PaymentProcessor } from './payment-processor.interface';


@Injectable()
export class PaymentProcessorFactory {
  constructor(private readonly stripeService: StripeService) {}

  getProcessor(provider: string): PaymentProcessor {
    // @ts-ignore
    switch (provider.toLowerCase()) {
      case 'stripe':

        return this.stripeService;

      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}
