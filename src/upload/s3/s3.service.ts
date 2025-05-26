// src/upload/s3/s3.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  FileStorageService,
  FileUploadResult,
} from '../interfaces/upload.interface';

@Injectable()
export class S3Service implements FileStorageService {
  private logger = new Logger(S3Service.name);
  private s3: S3;
  private bucket: string;

  constructor() {
    // Log les informations pour le debugging (à supprimer en production)
    this.logger.debug(
      `Initialisation S3 - Région: ${process.env.AWS_REGION}, Bucket: ${process.env.AWS_S3_BUCKET}`,
    );

    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_S3_BUCKET ?? '';
  }

  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(8).toString('hex');
    return `${hash}${ext}`;
  }

  async uploadSingle(
    file: Express.Multer.File,
    folder = 'documents',
  ): Promise<FileUploadResult> {
    const fileName = this.generateFileName(file.originalname);
    const key = folder ? `${folder}/${fileName}` : fileName;

    try {
      const params = {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      const uploadResult = await this.s3.upload(params).promise();

      this.logger.log(`✅ Upload OK: ${key}`);

      return {
        url: uploadResult.Location,
        id: key,
      };
    } catch (error) {
      this.logger.error(`❌ Erreur S3: ${JSON.stringify(error)}`);
      throw error;
    }
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
      const params = {
        Bucket: this.bucket,
        Key: fileId,
      };

      await this.s3.deleteObject(params).promise();
      this.logger.log(`🗑️ Fichier supprimé : ${fileId}`);
    } catch (error) {
      this.logger.warn(`⚠️ Suppression S3 échouée : ${fileId}`);
    }
  }
}