import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentModeDto } from './dto/create-payment-mode.dto';
import { UpdatePaymentModeDto } from './dto/update-payment-mode.dto';
import { ResponseService } from '../validation/exception/response/response.service';

@Injectable()
export class PaymentModeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponseService,
  ) {}

  async create(data: CreatePaymentModeDto) {
    const paymentMode = await this.prisma.paymentMode.create({
      data,
    });

    return this.responseService.created(
      paymentMode,
      'Payment mode created successfully.',
    );
  }

  async findAll() {
    const paymentModes = await this.prisma.paymentMode.findMany({
      where: { deletedAt: null },
    });

    return this.responseService.success(
      paymentModes,
      'List of payment modes retrieved.',
    );
  }

  async findOne(id: string) {
    const paymentMode = await this.prisma.paymentMode.findFirst({
      where: { id, deletedAt: null },
    });

    if (!paymentMode) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.notFound('Payment mode not found.');
    }

    return this.responseService.success(paymentMode, 'Payment mode retrieved.');
  }

  async update(id: string, data: UpdatePaymentModeDto) {
    const paymentMode = await this.prisma.paymentMode.update({
      where: { id },
      data,
    });

    return this.responseService.success(
      paymentMode,
      'Payment mode updated successfully.',
    );
  }

  async remove(id: string) {
    const paymentMode = await this.prisma.paymentMode.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return this.responseService.success(
      paymentMode,
      'Payment mode soft-deleted successfully.',
    );
  }
}
