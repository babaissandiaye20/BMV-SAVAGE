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

  async createPayment(dto: CreatePaymentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { payments: true },
    });

    if (!appointment || appointment.status !== AppointmentStatus.PENDING) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest(['Invalid appointment status.']);
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        appointmentId: dto.appointmentId,
        deletedAt: null,
        status: PaymentStatus.PAID,
      },
    });

    if (existingPayment) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest([
        'A payment has already been made for this appointment.',
      ]);
    }

    const paymentMode = await this.prisma.paymentMode.findUnique({
      where: { id: dto.paymentModeId },
    });

    if (!paymentMode || paymentMode.deletedAt) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest(['Invalid payment mode.']);
    }

    const processor = this.factory.getProcessor(paymentMode.name);
    const result = await processor.charge(
      dto.amount,
      dto.currency,
      dto.paymentDetails,
    );

    const payment = await this.prisma.payment.create({
      data: {
        userId: dto.userId,
        appointmentId: dto.appointmentId,
        paymentModeId: dto.paymentModeId,
        amount: dto.amount,
        status: result.status as PaymentStatus,
        transactionId: result.transactionId,
      },
    });

    return this.responseService.created(payment, 'Payment processed.');
  }

  async getAllTransactions() {
    const payments = await this.prisma.payment.findMany({
      where: { deletedAt: null },
      include: { user: true, appointment: true, paymentMode: true },
    });

    return this.responseService.success(payments, 'All transactions retrieved.');
  }

  async getTransactionsByUser(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { userId, deletedAt: null },
      include: { appointment: true, paymentMode: true },
    });

    return this.responseService.success(payments, 'User transactions retrieved.');
  }

  async getTransaction(transactionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: transactionId },
      include: { user: true, appointment: true, paymentMode: true },
    });

    if (!payment) {
      throw this.responseService.notFound('Transaction not found.');
    }

    return this.responseService.success(payment, 'Transaction details retrieved.');
  }
}
