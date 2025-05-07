import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class UpdateDocumentDto {
  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.RECEIPT,
    description: 'Nouveau type du document',
  })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  type: DocumentType;
}
