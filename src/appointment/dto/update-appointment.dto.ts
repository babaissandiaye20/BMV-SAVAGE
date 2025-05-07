import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @ApiProperty({ example: '1HGCM82633A123456', description: 'Numéro d\'identification du véhicule (VIN)', required: false })
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiProperty({ example: 'SUV', description: 'Type de véhicule', required: false })
  @IsString()
  @IsOptional()
  vehicleType?: string;

  @ApiProperty({ example: 'ABC123456', description: 'Numéro du titre', required: false })
  @IsString()
  @IsOptional()
  titleNumber?: string;

  @ApiProperty({ example: '2023-06-15T14:00:00', description: 'Date et heure du rendez-vous', required: false })
  @IsString()
  @IsOptional()
  scheduledAt?: string;

  @ApiProperty({ example: '123 Main St, City, State', description: 'Lieu du rendez-vous', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.CONFIRMED, description: 'Statut du rendez-vous', required: false })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}