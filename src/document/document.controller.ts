import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ParamDocumentIdDto } from './dto/param-document-id.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { Request } from 'express';

// Define a custom interface for the authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isPhoneVerified: boolean;
    codeOtp: string | null;
    phone: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    roleId: string | null

  };
}

@ApiTags('Documents')
@ApiBearerAuth('access-token')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Uploader un document (auth)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        type: {
          type: 'string',
          enum: ['LICENSE', 'TITLE', 'RECEIPT'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploadé avec succès',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDocumentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.documentService.upload(userId, file, body.type);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les documents de l’utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Liste des documents de l\'utilisateur',
    type: [DocumentResponseDto],
  })
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.documentService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un document par ID' })
  @ApiResponse({
    status: 200,
    description: 'Document trouvé',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Document non trouvé' })
  findOne(@Param() params: ParamDocumentIdDto) {
    return this.documentService.findOne(params.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour le type d’un document' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({
    status: 200,
    description: 'Document mis à jour',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Document non trouvé' })
  update(
    @Param() params: ParamDocumentIdDto,
    @Body() body: UpdateDocumentDto,
  ) {
    return this.documentService.update(params.id, body.type);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un document (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Document supprimé',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Document non trouvé' })
  remove(@Param() params: ParamDocumentIdDto) {
    return this.documentService.remove(params.id);
  }
}
