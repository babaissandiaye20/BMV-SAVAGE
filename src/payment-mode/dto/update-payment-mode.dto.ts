import { PartialType } from '@nestjs/swagger';
import { CreatePaymentModeDto } from './create-payment-mode.dto';

export class UpdatePaymentModeDto extends PartialType(CreatePaymentModeDto) {}
