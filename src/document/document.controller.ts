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
} from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ParamDocumentIdDto } from './dto/param-document-id.dto';
import { Request } from 'express';

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
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDocumentDto,
    @Req() req: Request,
  ) {
    // @ts-expect-error
    const userId = req.user['id'];
    return this.documentService.upload(userId, file, body.type);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les documents de l’utilisateur connecté' })
  findAll(@Req() req: Request) {
    // @ts-ignore
    const userId = req.user['id'];
    return this.documentService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un document par ID' })
  findOne(@Param() params: ParamDocumentIdDto) {
    return this.documentService.findOne(params.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour le type d’un document' })
  @ApiBody({ type: UpdateDocumentDto })
  update(
    @Param() params: ParamDocumentIdDto,
    @Body() body: UpdateDocumentDto,
  ) {
    return this.documentService.update(params.id, body.type);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un document (soft delete)' })
  remove(@Param() params: ParamDocumentIdDto) {
    return this.documentService.remove(params.id);
  }
}