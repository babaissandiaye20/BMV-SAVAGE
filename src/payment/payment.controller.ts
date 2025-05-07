import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment' })
  @ApiResponse({ status: 201, description: 'Payment processed.' })
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'All transactions retrieved.' })
  getAllTransactions() {
    return this.paymentService.getAllTransactions();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get transactions by user ID' })
  @ApiResponse({ status: 200, description: 'User transactions retrieved.' })
  getTransactionsByUser(@Param('userId') userId: string) {
    return this.paymentService.getTransactionsByUser(userId);
  }

  @Get(':transactionId')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction details retrieved.' })
  getTransaction(@Param('transactionId') transactionId: string) {
    return this.paymentService.getTransaction(transactionId);
  }
}
