import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateGuestAppointmentDto {
  @ApiProperty({ example: 'John', description: 'Prénom du client' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Nom du client' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email du client' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Numéro de téléphone du client' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '1HGCM82633A123456', description: 'Numéro d\'identification du véhicule (VIN)' })
  @IsString()
  @IsNotEmpty()
  vin: string;

  @ApiProperty({ example: 'SUV', description: 'Type de véhicule' })
  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @ApiProperty({ example: 'ABC123456', description: 'Numéro du titre' })
  @IsString()
  @IsNotEmpty()
  titleNumber: string;

  @ApiProperty({ example: 'REC123456', description: 'Numéro de reçu', required: false })
  @IsString()
  @IsOptional()
  receiptNumber?: string;

  @ApiProperty({ example: '2023-06-15T14:00:00', description: 'Date et heure du rendez-vous', required: false })
  @IsString()
  @IsOptional()
  scheduledAt?: string;

  @ApiProperty({ example: '123 Main St, City, State', description: 'Lieu du rendez-vous', required: false })
  @IsString()
  @IsOptional()
  location?: string;
  issuesDate: string | null;
  id: string;
}
