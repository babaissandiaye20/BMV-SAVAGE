import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BlacklistTokenService } from './blacklist-token/blacklist-token.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { SMS_SERVICE } from '../sms/sms.interface';
import { HttpException, UnauthorizedException, BadRequestException } from '@nestjs/common';

// Mock dependencies
const mockPrismaService = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  blacklistedToken: {
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
  decode: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

const mockBlacklistService = {
  blacklist: jest.fn(),
};

const mockRefreshTokenService = {
  create: jest.fn(),
  validate: jest.fn(),
  rotate: jest.fn(),
};

const mockResponseService = {
  success: jest.fn(),
  unauthorized: jest.fn(),
  notFound: jest.fn(),
  badRequest: jest.fn(),
  inactiveAccount: jest.fn(),
  conflict: jest.fn(),
};

const mockSmsService = {
  sendOtp: jest.fn(),
  verifyOtp: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: BlacklistTokenService, useValue: mockBlacklistService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: ResponseService, useValue: mockResponseService },
        { provide: SMS_SERVICE, useValue: mockSmsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw 401 when user is not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockResponseService.unauthorized.mockReturnValue('Identifiants invalides');

      await expect(service.login('test@example.com', 'password')).rejects.toThrow(HttpException);

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: null },
      });
    });

    it('should throw 400 when user phone is not verified', async () => {
      const mockUser = { 
        id: '1', 
        email: 'test@example.com', 
        password: 'hashedPassword', 
        isPhoneVerified: false 
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockResponseService.inactiveAccount.mockReturnValue('Phone not verified');

      // Mock bcrypt.compare to return true
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

      await expect(service.login('test@example.com', 'password')).rejects.toThrow(HttpException);

      expect(mockResponseService.inactiveAccount).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('requestPasswordReset', () => {
    it('should throw 404 when user is not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockResponseService.notFound.mockReturnValue('User not found');

      await expect(service.requestPasswordReset('test@example.com')).rejects.toThrow(HttpException);

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: null },
      });
      expect(mockResponseService.notFound).toHaveBeenCalledWith('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should throw 404 when user is not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockResponseService.notFound.mockReturnValue('User not found');

      await expect(service.resetPassword('test@example.com', '123456', 'newPassword')).rejects.toThrow(HttpException);

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: null },
      });
      expect(mockResponseService.notFound).toHaveBeenCalledWith('User not found');
    });

    it('should throw 400 when verification code is invalid', async () => {
      const mockUser = { 
        id: '1', 
        email: 'test@example.com', 
        phone: '+1234567890',
        password: 'hashedPassword' 
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockSmsService.verifyOtp.mockResolvedValue({ status: 'rejected' });
      mockResponseService.badRequest.mockReturnValue(['Invalid verification code']);

      await expect(service.resetPassword('test@example.com', '123456', 'newPassword')).rejects.toThrow(HttpException);

      expect(mockSmsService.verifyOtp).toHaveBeenCalledWith(mockUser.phone, '123456');
      expect(mockResponseService.badRequest).toHaveBeenCalledWith(['Invalid verification code']);
    });
  });

  describe('logout', () => {
    it('should throw BadRequestException when token is invalid', async () => {
      mockJwtService.decode.mockReturnValue(null);

      await expect(service.logout('invalid-token')).rejects.toThrow(BadRequestException);

      expect(mockJwtService.decode).toHaveBeenCalledWith('invalid-token');
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockRefreshTokenService.validate.mockResolvedValue(null);

      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException);

      expect(mockRefreshTokenService.validate).toHaveBeenCalledWith('invalid-token');
    });
  });
});
