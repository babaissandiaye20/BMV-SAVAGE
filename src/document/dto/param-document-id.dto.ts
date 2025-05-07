// src/document/dto/param-document-id.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { Exists } from '../../common/decorator/validators/exists.decorator';

export class ParamDocumentIdDto {
  @ApiProperty({ example: 'uuid-document', description: 'ID du document' })
  @IsUUID()
  @IsNotEmpty()
  @Exists('document', 'id', { message: 'Document introuvable' })
  id: string;
}
