// src/upload/upload.module.ts
import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { S3Service } from './s3/s3.service';


@Global()
@Module({
  providers: [
    CloudinaryService,
    S3Service,
    {
      provide: 'UploadService',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      useClass: CloudinaryService,
    },
    CloudinaryService,
  ],
  exports: ['UploadService'],
})
export class UploadModule {}
