// src/upload/cloudinary.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
  FileStorageService,
  FileUploadResult,
} from '../interfaces/upload.interface';
@Injectable()
export class CloudinaryService implements FileStorageService {
  private logger = new Logger(CloudinaryService.name);

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadSingle(
    file: Express.Multer.File,
    folder = 'documents',
  ): Promise<FileUploadResult> {
    return new Promise<FileUploadResult>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            this.logger.error(`❌ Erreur Cloudinary: ${JSON.stringify(error)}`);
            return reject(error);
          }
          if (!result) return reject(new Error('Upload vide'));

          this.logger.log(`✅ Upload OK: ${result.public_id}`);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          resolve({ url: result.secure_url, id: result.public_id });
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = 'documents',
  ): Promise<FileUploadResult[]> {
    if (!files?.length) return [];
    return await Promise.all(
      files.map((file) => this.uploadSingle(file, folder)),
    );
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      await cloudinary.uploader.destroy(fileId);
      this.logger.log(`🗑️ Fichier supprimé : ${fileId}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.logger.warn(`⚠️ Suppression Cloudinary échouée : ${fileId}`);
    }
  }
}
