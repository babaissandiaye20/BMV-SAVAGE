import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Exists } from '../../common/decorator/validators/exists.decorator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'uuid-user', description: 'ID de l\'utilisateur' })
  @IsUUID()
  @IsNotEmpty()
  @Exists('user', 'id', { message: 'Utilisateur introuvable' })
  userId: string;

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

  @ApiProperty({ example: '2023-06-15T14:00:00', description: 'Date et heure du rendez-vous' })
  @IsString()
  @IsNotEmpty()
  scheduledAt: string;

  @ApiProperty({ example: '123 Main St, City, State', description: 'Lieu du rendez-vous' })
  @IsString()
  @IsNotEmpty()
  location: string;
}