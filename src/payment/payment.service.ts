import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';

import { PaymentProcessorFactory } from './payment-processor.factory';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly factory: PaymentProcessorFactory,
    private readonly responseService: ResponseService,
  ) {}

  // @ts-ignore
  async createPayment(dto: CreatePaymentDto) {
    if (dto.appointmentIds.length !== dto.amounts.length) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest([
        'appointmentIds and amounts must have the same length.',
      ]);
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        id: { in: dto.appointmentIds },
        status: AppointmentStatus.PENDING,
        deletedAt: null,
      },
      include: { payments: true },
    });

    if (appointments.length !== dto.appointmentIds.length) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest([
        'One or more appointments are invalid or not pending.',
      ]);
    }

    for (const appointment of appointments) {
      const existingPayment = await this.prisma.payment.findFirst({
        where: {
          appointmentId: appointment.id,
          deletedAt: null,
          status: PaymentStatus.PAID,
        },
      });

      if (existingPayment) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw this.responseService.badRequest([
          `Appointment ${appointment.id} already has a paid payment.`,
        ]);
      }
    }

    const paymentMode = await this.prisma.paymentMode.findUnique({
      where: { id: dto.paymentModeId },
    });

    if (!paymentMode || paymentMode.deletedAt) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest(['Invalid payment mode.']);
    }

    const totalAmount = dto.amounts.reduce((sum, amount) => sum + amount, 0);

    const processor = this.factory.getProcessor(paymentMode.name);

    if (!processor.createCheckoutSession) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest([
        `createCheckoutSession is not supported by this processor`,
      ]);
    }

    const session = await processor.createCheckoutSession(
      totalAmount,
      dto.currency,
      process.env.STRIPE_SUCCESS_URL!,
      process.env.STRIPE_CANCEL_URL!,
      {
        userId: dto.userId,
        appointmentIds: dto.appointmentIds.join(','),
      }
    );

    return this.responseService.success(
      { checkoutUrl: session.url },
      'Redirection vers Stripe Checkout.',
    );
  }

  async getAllTransactions() {
    const payments = await this.prisma.payment.findMany({
      where: { deletedAt: null },
      include: { user: true, appointment: true, paymentMode: true },
    });

    return this.responseService.success(
      payments,
      'All transactions retrieved.',
    );
  }

  async getTransactionsByUser(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { userId, deletedAt: null },
      include: { appointment: true, paymentMode: true },
    });

    return this.responseService.success(
      payments,
      'User transactions retrieved.',
    );
  }

  async getTransaction(transactionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: transactionId },
      include: { user: true, appointment: true, paymentMode: true },
    });

    if (!payment) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.notFound('Transaction not found.');
    }

    return this.responseService.success(
      payment,
      'Transaction details retrieved.',
    );
  }
  async handleStripeSuccess(sessionId: string) {
    const stripeSession = await this.factory
      .getProcessor('stripe') // nom du provider
      .getTransactionDetails(sessionId);

    if (stripeSession.payment_status !== 'paid') {
      throw this.responseService.badRequest(['Payment not completed.']);
    }

    const metadata = stripeSession.metadata;
    const userId = metadata.userId;
    const appointmentIds = metadata.appointmentIds.split(',');

    const appointments = await this.prisma.appointment.findMany({
      where: { id: { in: appointmentIds }, deletedAt: null },
    });

    const totalAmount = stripeSession.amount_total! / 100;

    const paymentGroup = await this.prisma.paymentGroup.create({
      data: {
        userId,
        transactionId: sessionId,
        status: PaymentStatus.PAID,
        totalAmount,
      },
    });

    await Promise.all(
      appointments.map((appointment) =>
        this.prisma.payment.create({
          data: {
            userId,
            appointmentId: appointment.id,
            paymentModeId: 'manual-checkout', // change si tu veux le passer dans metadata aussi
            amount: totalAmount / appointments.length,
            status: PaymentStatus.PAID,
            paymentGroupId: paymentGroup.id,
            transactionId: sessionId,
          },
        })
      )
    );

    return this.responseService.success(
      { paymentGroup },
      'Paiement validé et enregistré.'
    );
  }

}
