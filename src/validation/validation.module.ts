import { Module, Global } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ExceptionService } from './exception/exception.service';
import { ResponseService } from './exception/response/response.service';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  providers: [
    ValidationService,
    ExceptionService,
    ResponseService,
    PrismaService,
  ],
  exports: [ValidationService, ExceptionService, ResponseService],
})
export class ValidationModule {}
