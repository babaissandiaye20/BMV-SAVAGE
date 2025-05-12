import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionService } from './exception.service';
import { ResponseService } from './response/response.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

describe('ExceptionService', () => {
  let service: ExceptionService;

  // Create a mock for ResponseService with more detailed return values
  const mockResponseService = {
    badRequest: jest.fn().mockImplementation((errors, message) => ({
      statusCode: 400,
      message,
      errors,
      timestamp: expect.any(String)
    })),
    forbidden: jest.fn().mockImplementation((message) => ({
      statusCode: 403,
      message,
      timestamp: expect.any(String)
    })),
    notFound: jest.fn().mockImplementation((message) => ({
      statusCode: 404,
      message,
      timestamp: expect.any(String)
    })),
    internalError: jest.fn().mockImplementation((message) => ({
      statusCode: 500,
      message,
      timestamp: expect.any(String)
    }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExceptionService,
        { provide: ResponseService, useValue: mockResponseService }
      ],
    }).compile();

    service = module.get<ExceptionService>(ExceptionService);

    // Reset mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createValidationException', () => {
    it('should create a validation exception with valid errors', () => {
      // Arrange
      const validationErrors: ValidationError[] = [
        {
          property: 'email',
          constraints: {
            isEmail: 'email must be a valid email',
            isNotEmpty: 'email should not be empty'
          },
          children: []
        }
      ];

      // Act
      const exception = service.createValidationException(validationErrors);

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(mockResponseService.badRequest).toHaveBeenCalledWith(
        ['email must be a valid email', 'email should not be empty'],
        'Erreur de validation'
      );
    });

    it('should handle nested validation errors', () => {
      // Arrange
      const nestedValidationErrors: ValidationError[] = [
        {
          property: 'user',
          children: [
            {
              property: 'address',
              constraints: {
                isNotEmpty: 'address should not be empty'
              },
              children: []
            }
          ]
        }
      ];

      // Act
      const exception = service.createValidationException(nestedValidationErrors);

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(mockResponseService.badRequest).toHaveBeenCalledWith(
        ['address should not be empty'],
        'Erreur de validation'
      );
    });

    it('should handle empty validation errors array', () => {
      // Act
      const exception = service.createValidationException([]);

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(mockResponseService.badRequest).toHaveBeenCalledWith(
        [],
        'Erreur de validation'
      );
    });

    it('should handle validation errors with null constraints', () => {
      // Arrange
      const invalidValidationErrors: ValidationError[] = [
        {
          property: 'email',
          constraints: undefined,
          children: [],
        }
      ];

      // Act
      const exception = service.createValidationException(
        invalidValidationErrors,
      );

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(mockResponseService.badRequest).toHaveBeenCalledWith(
        [],
        'Erreur de validation'
      );
    });

    it('should handle validation errors with undefined constraints', () => {
      // Arrange
      const invalidValidationErrors: ValidationError[] = [
        {
          property: 'email',
          constraints: undefined,
          children: []
        }
      ];

      // Act
      const exception = service.createValidationException(invalidValidationErrors);

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(mockResponseService.badRequest).toHaveBeenCalledWith(
        [],
        'Erreur de validation'
      );
    });
  });

  describe('createForbiddenException', () => {
    it('should create a forbidden exception with a valid message', () => {
      // Arrange
      const message = 'Access denied';

      // Act
      const exception = service.createForbiddenException(message);

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect(mockResponseService.forbidden).toHaveBeenCalledWith(message);
    });

    it('should handle empty message', () => {
      // Act
      const exception = service.createForbiddenException('');

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect(mockResponseService.forbidden).toHaveBeenCalledWith('');
    });
  });

  describe('createNotFoundException', () => {
    it('should create a not found exception with a valid message', () => {
      // Arrange
      const message = 'Resource not found';

      // Act
      const exception = service.createNotFoundException(message);

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(mockResponseService.notFound).toHaveBeenCalledWith(message);
    });

    it('should handle empty message', () => {
      // Act
      const exception = service.createNotFoundException('');

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(mockResponseService.notFound).toHaveBeenCalledWith('');
    });
  });

  describe('createInternalServerException', () => {
    it('should create an internal server exception with a valid message', () => {
      // Arrange
      const message = 'Internal server error';

      // Act
      const exception = service.createInternalServerException(message);

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponseService.internalError).toHaveBeenCalledWith(message);
    });

    it('should handle empty message', () => {
      // Act
      const exception = service.createInternalServerException('');

      // Assert
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponseService.internalError).toHaveBeenCalledWith('');
    });
  });
});
