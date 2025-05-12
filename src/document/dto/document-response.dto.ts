import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';

export class DocumentResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID unique du document',
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de l\'utilisateur propriétaire du document',
  })
  userId: string;

  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.LICENSE,
    description: 'Type du document',
  })
  type: DocumentType;

  @ApiProperty({
    example: 'https://example.com/documents/file.pdf',
    description: 'URL du fichier',
  })
  fileUrl: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Date d\'upload du document',
  })
  uploadedAt: Date;

  @ApiProperty({
    example: null,
    description: 'Date de suppression du document (null si non supprimé)',
    required: false,
  })
  deletedAt: Date | null;
}