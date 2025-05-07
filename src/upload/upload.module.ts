// src/upload/upload.module.ts
import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';


@Global()
@Module({
  providers: [
    CloudinaryService,
    {
      provide: 'UploadService',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      useClass: CloudinaryService,
    },
  ],
  exports: ['UploadService'],
})
export class UploadModule {}
