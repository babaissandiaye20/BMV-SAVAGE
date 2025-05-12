import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { ExceptionService } from './exception/exception.service';
import { ValidationError } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ValidationService', () => {
  let service: ValidationService;
  let exceptionService: ExceptionService;

  // Mock the ExceptionService
  const mockExceptionService = {
    createValidationException: jest.fn().mockImplementation((errors) => {
      return new HttpException({ statusCode: 400, message: 'Validation Error' }, HttpStatus.BAD_REQUEST);
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationService,
        { provide: ExceptionService, useValue: mockExceptionService }
      ],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
    exceptionService = module.get<ExceptionService>(ExceptionService);

    // Reset mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validation pipe configuration', () => {
    it('should have whitelist enabled', () => {
      // We can't directly access private properties, but we can test the behavior
      expect((service as any).options.whitelist).toBe(true);
    });

    it('should have transform enabled', () => {
      expect((service as any).options.transform).toBe(true);
    });

    it('should have forbidNonWhitelisted enabled', () => {
      expect((service as any).options.forbidNonWhitelisted).toBe(true);
    });

    it('should have validationError.target disabled', () => {
      expect((service as any).options.validationError.target).toBe(false);
    });

    it('should have validationError.value disabled', () => {
      expect((service as any).options.validationError.value).toBe(false);
    });

    it('should have enableImplicitConversion enabled', () => {
      expect((service as any).options.transformOptions.enableImplicitConversion).toBe(true);
    });
  });

  describe('exceptionFactory', () => {
    it('should use ExceptionService to create validation exceptions', () => {
      // Arrange
      const validationErrors: ValidationError[] = [
        {
          property: 'email',
          constraints: {
            isEmail: 'email must be a valid email'
          },
          children: []
        }
      ];

      // Act
      const exceptionFactory = (service as any).options.exceptionFactory;
      const exception = exceptionFactory(validationErrors);

      // Assert
      expect(mockExceptionService.createValidationException).toHaveBeenCalledWith(validationErrors);
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should handle empty validation errors array', () => {
      // Act
      const exceptionFactory = (service as any).options.exceptionFactory;
      const exception = exceptionFactory([]);

      // Assert
      expect(mockExceptionService.createValidationException).toHaveBeenCalledWith([]);
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should handle validation errors with inconsistent data', () => {
      // Arrange
      const inconsistentValidationErrors: any[] = [
        null,
        undefined,
        {},
        { property: 'email', constraints: null },
        { property: 'email', constraints: undefined },
        { property: 'email', constraints: {} },
        { property: 'email', constraints: { isEmail: null } },
        { property: 'email', constraints: { isEmail: undefined } },
        { property: 'email', constraints: { isEmail: '' } },
        { property: 'email', children: null },
        { property: 'email', children: undefined },
        { property: 'email', children: [] },
        { property: 'email', children: [null, undefined, {}] }
      ];

      // Act & Assert
      const exceptionFactory = (service as any).options.exceptionFactory;

      // Test each inconsistent validation error individually
      inconsistentValidationErrors.forEach(error => {
        // Reset mock before each call
        jest.clearAllMocks();

        // Create an array with just this error
        const errors = error ? [error] : [];

        // Call the exception factory
        const exception = exceptionFactory(errors);

        // Verify the exception service was called with the errors
        expect(mockExceptionService.createValidationException).toHaveBeenCalledWith(errors);
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
