import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { Exists } from '../../common/decorator/validators/exists.decorator';

export class ParamUserIdDto {
  @ApiProperty({ example: 'uuid-user', description: 'ID de l\'utilisateur' })
  @IsUUID()
  @IsNotEmpty()
  @Exists('user', 'id', { message: 'Utilisateur introuvable' })
  userId: string;
}