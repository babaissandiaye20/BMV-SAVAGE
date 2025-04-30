import { Module } from '@nestjs/common';
import { ResponseService } from '../validation/exception/response/response.service';
import { PaymentModeService } from './payment-mode.service';
import { PaymentModeController } from './payment-mode.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentModeController],
  providers: [ResponseService, PaymentModeService],
  exports: [],
})
export class PaymentModeModule {}
