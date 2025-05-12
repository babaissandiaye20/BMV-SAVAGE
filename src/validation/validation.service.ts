// validation/validation.service.ts
import { Injectable } from '@nestjs/common';
import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ExceptionService } from './exception/exception.service';
@Injectable()
export class ValidationService extends ValidationPipe {
  // Make options accessible for testing
  readonly options: ValidationPipeOptions;

  constructor(private readonly exceptionService: ExceptionService) {
    const options: ValidationPipeOptions = {
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
        value: false,
      },
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        return this.exceptionService.createValidationException(errors);
      },
    };
    super(options);
    this.options = options;
  }
}
