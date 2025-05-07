import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ResponseService } from '../validation/exception/response/response.service';

import { PaymentService } from './payment.service';
import { StripeService } from './stripe/stripe.service';
import { PaymentController } from './payment.controller';
import { PaymentProcessorFactory } from './payment-processor.factory';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService, // Inject Stripe as payment processor
    PaymentProcessorFactory, // Factory to choose the processor
    ResponseService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
