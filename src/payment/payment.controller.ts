import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Query } from '@nestjs/common';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment for one or multiple appointments' })
  @ApiResponse({
    status: 201,
    description: 'Payment group processed successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Payment group processed successfully.',
        data: {
          paymentGroup: {
            id: 'payment-group-uuid',
            userId: 'user-uuid',
            transactionId: 'pi_123456789',
            status: 'PAID',
            totalAmount: 125.00,
            createdAt: '2025-05-15T16:15:00.000Z',
          },
          payments: [
            {
              id: 'payment-uuid-1',
              userId: 'user-uuid',
              appointmentId: 'appointment-uuid-1',
              paymentGroupId: 'payment-group-uuid',
              paymentModeId: 'payment-mode-uuid',
              amount: 50.00,
              status: 'PAID',
              transactionId: null,
              createdAt: '2025-05-15T16:15:00.000Z',
            },
            {
              id: 'payment-uuid-2',
              userId: 'user-uuid',
              appointmentId: 'appointment-uuid-2',
              paymentGroupId: 'payment-group-uuid',
              paymentModeId: 'payment-mode-uuid',
              amount: 75.00,
              status: 'PAID',
              transactionId: null,
              createdAt: '2025-05-15T16:15:00.000Z',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  @ApiBody({ type: CreatePaymentDto })
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'All transactions retrieved.',
    schema: {
      example: {
        status: 'success',
        message: 'All transactions retrieved.',
        data: [
          {
            id: 'payment-uuid-1',
            userId: 'user-uuid',
            appointmentId: 'appointment-uuid-1',
            paymentModeId: 'payment-mode-uuid',
            status: 'PAID',
            transactionId: 'pi_123456789',
            amount: 50.00,
            createdAt: '2025-05-15T16:15:00.000Z',
            user: { id: 'user-uuid', email: 'user@example.com' },
            appointment: { id: 'appointment-uuid-1', titleNumber: 'ABC123' },
            paymentMode: { id: 'payment-mode-uuid', name: 'Credit Card' },
          },
        ],
      },
    },
  })
  getAllTransactions() {
    return this.paymentService.getAllTransactions();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get transactions by user ID' })
  @ApiResponse({
    status: 200,
    description: 'User transactions retrieved.',
    schema: {
      example: {
        status: 'success',
        message: 'User transactions retrieved.',
        data: [
          {
            id: 'payment-uuid-1',
            userId: 'user-uuid',
            appointmentId: 'appointment-uuid-1',
            paymentModeId: 'payment-mode-uuid',
            status: 'PAID',
            transactionId: 'pi_123456789',
            amount: 50.0,
            createdAt: '2025-05-15T16:15:00.000Z',
            appointment: { id: 'appointment-uuid-1', titleNumber: 'ABC123' },
            paymentMode: { id: 'payment-mode-uuid', name: 'Credit Card' },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user',
    example: 'user-uuid',
  })
  getTransactionsByUser(@Param('userId') userId: string) {
    return this.paymentService.getTransactionsByUser(userId);
  }

  @Get(':transactionId')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details retrieved.',
    schema: {
      example: {
        status: 'success',
        message: 'Transaction details retrieved.',
        data: {
          id: 'payment-uuid-1',
          userId: 'user-uuid',
          appointmentId: 'appointment-uuid-1',
          paymentModeId: 'payment-mode-uuid',
          status: 'PAID',
          transactionId: 'pi_123456789',
          amount: 50.00,
          createdAt: '2025-05-15T16:15:00.000Z',
          user: { id: 'user-uuid', email: 'user@example.com' },
          appointment: { id: 'appointment-uuid-1', titleNumber: 'ABC123' },
          paymentMode: { id: 'payment-mode-uuid', name: 'Credit Card' },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiParam({
    name: 'transactionId',
    description: 'ID of the transaction',
    example: 'payment-uuid-1',
  })
  getTransaction(@Param('transactionId') transactionId: string) {
    return this.paymentService.getTransaction(transactionId);
  }
  @Get('/success')
  @ApiOperation({ summary: 'Handle Stripe success redirect' })
  @ApiResponse({ status: 200, description: 'Paiement validé avec succès.' })
  handleSuccess(@Query('session_id') sessionId: string) {
    return this.paymentService.handleStripeSuccess(sessionId);
  }
}
