import { Global, Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ExceptionService } from './exception/exception.service';
import { ResponseService } from './exception/response/response.service';

@Global() // Rend ce module accessible dans toute l'application
@Module({
  providers: [ValidationService, ExceptionService, ResponseService],
  exports: [ValidationService, ExceptionService, ResponseService], // Exporte les services pour les autres modules
})
export class ValidationModule {}
