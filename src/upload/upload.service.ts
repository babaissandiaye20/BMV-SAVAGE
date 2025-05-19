// @ts-ignore

import { Injectable, Logger } from '@nestjs/common';

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  FileStorageService,
  FileUploadResult,
} from './interfaces/upload.interface';
@Injectable()
export class UploadService implements FileStorageService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadFile(image: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }
  private logger = new Logger(UploadService.name);
  private baseDir: string;

  constructor() {
    this.baseDir = process.env.UPLOAD_DIR || 'uploads';
  }

  private async ensureDirectory(folder: string): Promise<string> {
    const dirPath = path.join(this.baseDir, folder);
    await fs.mkdir(dirPath, { recursive: true });
    return dirPath;
  }

  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(8).toString('hex');
    return `${hash}${ext}`;
  }

  async uploadSingle(
    file: Express.Multer.File,
    folder: string = 'hotel-chambres',
  ): Promise<FileUploadResult> {
    const dirPath = await this.ensureDirectory(folder);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const fileName = this.generateFileName(file.originalname);
    const filePath = path.join(dirPath, fileName);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      await fs.writeFile(filePath, file.buffer);
      const relativePath = path.join(folder, fileName);

      return {
        url: `/uploads/${relativePath}`,
        id: relativePath,
      };
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Erreur lors de l'enregistrement du fichier: ${error.message}`,
      );
      throw error;
    }
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string = 'hotel-chambres',
  ): Promise<FileUploadResult[]> {
    if (!files?.length) return [];

    try {
      return await Promise.all(
        files.map((file) => this.uploadSingle(file, folder)),
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Échec de l'upload batch: ${error.nmessage}`);
      throw error;
    }
  }
  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.baseDir, filePath);
    try {
      await fs.unlink(fullPath);
      this.logger.log(`🗑️ Fichier supprimé : ${filePath}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.logger.warn(`⚠️ Impossible de supprimer le fichier : ${filePath}`);
    }
  }
}
