// validation/exception/exception.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ResponseService } from './response/response.service';

@Injectable()
export class ExceptionService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createBadRequestException(arg0: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly httpResponseService: ResponseService) {}

  createValidationException(errors: ValidationError[]): HttpException {
    const messages = this.formatErrors(errors);
    const response = this.httpResponseService.badRequest(
      messages,
      'Erreur de validation',
    );
    return new HttpException(response, HttpStatus.BAD_REQUEST);
  }

  createForbiddenException(message: string): HttpException {
    const response = this.httpResponseService.forbidden(message);
    return new HttpException(response, HttpStatus.FORBIDDEN);
  }

  createNotFoundException(message: string): HttpException {
    const response = this.httpResponseService.notFound(message);
    return new HttpException(response, HttpStatus.NOT_FOUND);
  }

  createInternalServerException(message: string): HttpException {
    const response = this.httpResponseService.internalError(message);
    return new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private formatErrors(errors: ValidationError[]): string[] {
    const messages: string[] = [];
    errors.forEach((error) => {
      if (error.constraints) {
        Object.values(error.constraints).forEach((message) => {
          messages.push(message);
        });
      }
      if (error.children && error.children.length > 0) {
        messages.push(...this.formatErrors(error.children));
      }
    });
    return messages;
  }
}
