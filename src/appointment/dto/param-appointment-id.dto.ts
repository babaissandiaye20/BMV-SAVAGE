import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { Exists } from '../../common/decorator/validators/exists.decorator';

export class ParamAppointmentIdDto {
  @ApiProperty({ example: 'uuid-appointment', description: 'ID du rendez-vous' })
  @IsUUID()
  @IsNotEmpty()
  @Exists('appointment', 'id', { message: 'Rendez-vous introuvable' })
  id: string;
}