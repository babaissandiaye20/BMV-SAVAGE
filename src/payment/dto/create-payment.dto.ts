import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID de l’utilisateur', example: 'user-uuid' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Liste des IDs des rendez-vous à payer' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  appointmentIds: string[];

  @ApiProperty({
    description: 'ID du mode de paiement',
    example: 'payment-mode-uuid',
  })
  @IsString()
  @IsNotEmpty()
  paymentModeId: string;

  @ApiProperty({ description: 'Liste des montants par rendez-vous' })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Min(0.01, { each: true })
  amounts: number[];

  @ApiProperty({ description: 'Devise utilisée', example: 'usd' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}
