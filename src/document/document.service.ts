// src/document/document.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  FileStorageService,
  FileUploadResult,
} from '../upload/interfaces/upload.interface';
import { ResponseService } from '../validation/exception/response/response.service';
import { DocumentType } from '@prisma/client';
import { DocumentResponseDto } from './dto/document-response.dto';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponseService,
    @Inject('UploadService')
    private readonly uploadService: FileStorageService,
  ) {}

  async upload(userId: string, file: Express.Multer.File | null, type: DocumentType) {
    if (!file) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest(['Aucun fichier fourni']);
    }

    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      throw this.responseService.badRequest([
        'Fichier trop volumineux (> 4 Mo)',
      ]);
    }

    const uploaded: FileUploadResult = await this.uploadService.uploadSingle(
      file,
      'documents',
    );

    const doc = await this.prisma.document.create({
      data: {
        userId,
        type,
        fileUrl: uploaded.url,
      },
    });

    const responseDto: DocumentResponseDto = {
      ...doc,
    };

    return this.responseService.created(responseDto, 'Document uploadé');
  }

  async findAll(userId: string) {
    const docs = await this.prisma.document.findMany({
      where: { userId, deletedAt: null },
    });

    const responseDtos: DocumentResponseDto[] = docs.map(doc => ({
      ...doc,
    }));

    return this.responseService.success(responseDtos, 'Documents retrouvés');
  }

  async findOne(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });

    if (!doc) {
      return this.responseService.success(null, 'Document non trouvé');
    }

    const responseDto: DocumentResponseDto = {
      ...doc,
    };

    return this.responseService.success(responseDto, 'Document trouvé');
  }

  async update(id: string, type: DocumentType) {
    const doc = await this.prisma.document.update({
      where: { id },
      data: { type },
    });

    const responseDto: DocumentResponseDto = {
      ...doc,
    };

    return this.responseService.success(responseDto, 'Document mis à jour');
  }

  async remove(id: string) {
    const doc = await this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.uploadService.deleteFile(doc.fileUrl);

    const responseDto: DocumentResponseDto = {
      ...doc,
    };

    return this.responseService.success(responseDto, 'Document supprimé');
  }
}
