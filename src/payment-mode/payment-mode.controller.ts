// src/payment-mode/payment-mode.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentModeService } from './payment-mode.service';
import { CreatePaymentModeDto } from './dto/create-payment-mode.dto';
import { UpdatePaymentModeDto } from './dto/update-payment-mode.dto';

@ApiTags('Payment Modes')
@ApiBearerAuth()
@Controller('payment-modes')
export class PaymentModeController {
  constructor(private readonly paymentModeService: PaymentModeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment mode' })
  @ApiResponse({
    status: 201,
    description: 'Payment mode created successfully.',
  })
  create(@Body() createPaymentModeDto: CreatePaymentModeDto) {
    return this.paymentModeService.create(createPaymentModeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment modes' })
  @ApiResponse({ status: 200, description: 'List of payment modes.' })
  findAll() {
    return this.paymentModeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment mode by ID' })
  @ApiResponse({ status: 200, description: 'Payment mode retrieved.' })
  findOne(@Param('id') id: string) {
    return this.paymentModeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment mode by ID' })
  @ApiResponse({ status: 200, description: 'Payment mode updated.' })
  update(
    @Param('id') id: string,
    @Body() updatePaymentModeDto: UpdatePaymentModeDto,
  ) {
    return this.paymentModeService.update(id, updatePaymentModeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a payment mode by ID' })
  @ApiResponse({ status: 200, description: 'Payment mode soft-deleted.' })
  remove(@Param('id') id: string) {
    return this.paymentModeService.remove(id);
  }
}
