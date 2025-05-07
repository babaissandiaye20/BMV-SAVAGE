// src/document/dto/param-user-id.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Exists } from '../../common/decorator/validators/exists.decorator';

export class ParamUserIdDto {
  @ApiProperty({ example: 'uuid-user', description: 'ID utilisateur' })
  @IsUUID()
  @IsNotEmpty()
  @Exists('user', 'id', { message: 'Utilisateur introuvable' })
  userId: string;
}
