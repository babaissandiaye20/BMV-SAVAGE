import { Controller, Post, Get, Body, Param, Query, Res } from '@nestjs/common';
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
import { Public } from '../common/decorator/public.decorator';
import { Response } from 'express';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@Public()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a payment for one or multiple appointments',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment group processed successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  @ApiBody({ type: CreatePaymentDto })
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'All transactions retrieved.',
  })
  async getAllTransactions() {
    return this.paymentService.getAllTransactions();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get transactions by user ID' })
  @ApiResponse({
    status: 200,
    description: 'User transactions retrieved.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user',
    example: 'user-uuid',
  })
  async getTransactionsByUser(@Param('userId') userId: string) {
    return this.paymentService.getTransactionsByUser(userId);
  }
  @Post('intent')
  @ApiOperation({ summary: 'Create Stripe PaymentIntent (NEW)' })
  async createPaymentIntent(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPaymentIntent(dto);
  }
  // === ATTENTION À L'ORDRE : /success AVANT :transactionId ===
  @Get('/success')
  async handleSuccess(
    @Query('session_id') sessionId: string,
    @Res() res: Response,
  ) {
    await this.paymentService.handleStripeSuccess(sessionId); // logique backend, pas de return
    // Sert le fichier statique
    res.sendFile('payment-success.html', { root: process.cwd() + '/public' });
  }

  @Get('/cancel')
  handleCancel(@Res() res: Response) {
    res.sendFile('payment-cancel.html', { root: process.cwd() + '/public' });
  }

  @Get(':transactionId')
  @ApiOperation({
    summary: 'Get transaction by ID (UUID interne ou Stripe session_id)',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction details retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiParam({
    name: 'transactionId',
    description: 'ID du paiement (UUID interne ou Stripe session_id cs_...)',
    example: 'payment-uuid-1 OU cs_test_xxx',
  })
  async getTransaction(@Param('transactionId') transactionId: string) {
    return this.paymentService.getTransaction(transactionId);
  }
}
