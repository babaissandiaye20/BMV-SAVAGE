import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from '../../common/decorator/validators/unique.decorator';

// @ts-ignore
export class CreatePaymentModeDto {
  @ApiProperty({
    example: 'Carte Bancaire',
    description: 'Nom du mode de paiement',
  })
  @IsString()
  @IsNotEmpty()
  @Unique('paymentMode', 'name', {
  message: 'Payment mode name already exists',
  })
  name: string;
}
