// src/document/document.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  FileStorageService,
  FileUploadResult,
} from '../upload/interfaces/upload.interface';
import { ResponseService } from '../validation/exception/response/response.service';
import { DocumentType } from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponseService,
    @Inject('UploadService')
    private readonly uploadService: FileStorageService,
  ) {}

  async upload(userId: string, file: Express.Multer.File, type: DocumentType) {
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

    return this.responseService.created(doc, 'Document uploadé');
  }

  async findAll(userId: string) {
    const docs = await this.prisma.document.findMany({
      where: { userId, deletedAt: null },
    });
    return this.responseService.success(docs, 'Documents retrouvés');
  }

  async findOne(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    return this.responseService.success(doc, 'Document trouvé');
  }

  async update(id: string, type: DocumentType) {
    const doc = await this.prisma.document.update({
      where: { id },
      data: { type },
    });
    return this.responseService.success(doc, 'Document mis à jour');
  }

  async remove(id: string) {
    const doc = await this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.uploadService.deleteFile(doc.fileUrl);

    return this.responseService.success(doc, 'Document supprimé');
  }
}
