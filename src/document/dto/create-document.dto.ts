import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class CreateDocumentDto {
  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.LICENSE,
    description: 'Type du document',
  })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  type: DocumentType;
}
