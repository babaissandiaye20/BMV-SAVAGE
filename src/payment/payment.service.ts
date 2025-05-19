import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import { PaymentProcessorFactory } from './payment-processor.factory';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly factory: PaymentProcessorFactory,
    private readonly responseService: ResponseService,
  ) {
  }

  /**
   * Crée la session Checkout Stripe (mais ne crée rien en base pour l’instant)
   */
  async createPayment(dto: any) {
    if (dto.appointmentIds.length !== dto.amounts.length) {
      throw this.responseService.badRequest([
        'appointmentIds and amounts must have the same length.',
      ]);
    }

    // Check appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        id: { in: dto.appointmentIds },
        status: AppointmentStatus.PENDING,
        deletedAt: null,
      },
      include: { payments: true },
    });

    if (appointments.length !== dto.appointmentIds.length) {
      throw this.responseService.badRequest([
        'One or more appointments are invalid or not pending.',
      ]);
    }

    // Check already paid
    for (const appointment of appointments) {
      const existingPayment = await this.prisma.payment.findFirst({
        where: {
          appointmentId: appointment.id,
          deletedAt: null,
          status: PaymentStatus.PAID,
        },
      });

      if (existingPayment) {
        throw this.responseService.badRequest([
          `Appointment ${appointment.id} already has a paid payment.`,
        ]);
      }
    }

    // Check payment mode
    const paymentMode = await this.prisma.paymentMode.findUnique({
      where: { id: dto.paymentModeId },
    });

    if (!paymentMode || paymentMode.deletedAt) {
      throw this.responseService.badRequest(['Invalid payment mode.']);
    }

    // Total
    const totalAmount = dto.amounts.reduce((sum, amount) => sum + amount, 0);

    // Get Stripe processor
    const processor = this.factory.getProcessor(paymentMode.name);

    if (!processor.createCheckoutSession) {
      throw this.responseService.badRequest([
        `createCheckoutSession is not supported by this processor`,
      ]);
    }

    // Crée la session Stripe (pas de création PaymentGroup ici)
    const session = await processor.createCheckoutSession(
      totalAmount,
      dto.currency,
      process.env.STRIPE_SUCCESS_URL!,
      process.env.STRIPE_CANCEL_URL!,
      {
        userId: dto.userId,
        appointmentIds: dto.appointmentIds.join(','),
        paymentModeId: dto.paymentModeId,
        amounts: dto.amounts.join(','), // pour mapping montant/rdv
      }
    );

    return this.responseService.success(
      { checkoutUrl: session.url },
      'Redirection vers Stripe Checkout.',
    );
  }

  /**
   * Liste tous les paiements (transactions)
   */
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

  /**
   * Liste les paiements par user
   */
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

  /**
   * Détail transaction par ID (interne ou Stripe sessionId)
   */
  async getTransaction(transactionId: string) {
    // Recherche par Stripe sessionId (transactionId)
    let payment = await this.prisma.payment.findFirst({
      where: { transactionId },
      include: { user: true, appointment: true, paymentMode: true },
    });

    // Sinon recherche par id interne
    if (!payment) {
      payment = await this.prisma.payment.findUnique({
        where: { id: transactionId },
        include: { user: true, appointment: true, paymentMode: true },
      });
    }

    if (!payment) {
      // Debug log
      console.log('Transaction recherchée:', transactionId);
      const payments = await this.prisma.payment.findMany({});
      console.log('Toutes les transactions en base:', payments.map(p => ({
        id: p.id,
        transactionId: p.transactionId
      })));
      throw this.responseService.notFound('Transaction not found.');
    }

    return this.responseService.success(
      payment,
      'Transaction details retrieved.',
    );
  }

  /**
   * Callback Stripe après succès (Redirection du front)
   * C'est ici qu'on crée en base PaymentGroup + Payments
   */
  async handleStripeSuccess(sessionId: string) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not defined');

    const stripe = new Stripe(secretKey, { apiVersion: '2025-04-30.basil' });

    // 1. Récupère la session Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Vérifie les metadata
    const metadata = stripeSession.metadata;
    if (
      !metadata ||
      !metadata.userId ||
      !metadata.appointmentIds ||
      !metadata.paymentModeId ||
      !metadata.amounts
    ) {
      return this.responseService.badRequest([
        'Metadata Stripe manquante ou incomplète.',
      ]);
    }

    const userId = metadata.userId;
    const appointmentIds = metadata.appointmentIds.split(',');
    const paymentModeId = metadata.paymentModeId;
    const amounts = metadata.amounts
      ? metadata.amounts.split(',').map((n: string) => parseFloat(n))
      : [];
    const totalAmount = stripeSession.amount_total! / 100;

    // 3. Création PaymentGroup
    const paymentGroup = await this.prisma.paymentGroup.create({
      data: {
        userId,
        transactionId: sessionId,
        status: PaymentStatus.PAID,
        totalAmount,
      },
    });

    // 4. Création des paiements individuels
    await Promise.all(
      appointmentIds.map(async (appointmentId: string, idx: number) => {
        const amount =
          amounts.length === appointmentIds.length
            ? amounts[idx]
            : totalAmount / appointmentIds.length;
        await this.prisma.payment.create({
          data: {
            userId,
            appointmentId,
            paymentModeId,
            amount,
            status: PaymentStatus.PAID,
            paymentGroupId: paymentGroup.id,
            transactionId: sessionId,
          },
        });
      }),
    );

    // 5. Recharge pour la réponse
    const paymentGroupWithPayments = await this.prisma.paymentGroup.findUnique({
      where: { id: paymentGroup.id },
      include: { payments: true },
    });

    return this.responseService.success(
      { paymentGroup: paymentGroupWithPayments },
      'Paiement validé et enregistré.'
    );
  }
}