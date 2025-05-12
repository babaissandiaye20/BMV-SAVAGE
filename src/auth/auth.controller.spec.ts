import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException, BadRequestException, UnauthorizedException } from '@nestjs/common';

// Mock AuthService
const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  refresh: jest.fn(),
  requestPasswordReset: jest.fn(),
  resetPassword: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

   beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      mockAuthService.login.mockResolvedValue({ success: true });

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual({ success: true });
    });

    it('should handle 400 error when user phone is not verified', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      mockAuthService.login.mockRejectedValue(new HttpException('Phone not verified', 400));

      await expect(controller.login(loginDto)).rejects.toThrow(HttpException);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with correct token', async () => {
      const authHeader = 'Bearer token123';
      mockAuthService.logout.mockResolvedValue({ success: true });

      const result = await controller.logout(authHeader);

      expect(authService.logout).toHaveBeenCalledWith('token123');
      expect(result).toEqual({ success: true });
    });

    it('should handle 400 error when token is invalid', async () => {
      const authHeader = 'Bearer invalid-token';
      mockAuthService.logout.mockRejectedValue(new BadRequestException('Token invalid'));

      await expect(controller.logout(authHeader)).rejects.toThrow(BadRequestException);

      expect(authService.logout).toHaveBeenCalledWith('invalid-token');
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh with correct refresh token', async () => {
      const body = { refreshToken: 'refresh-token-123' };
      mockAuthService.refresh.mockResolvedValue({ success: true });

      const result = await controller.refresh(body);

      expect(authService.refresh).toHaveBeenCalledWith(body.refreshToken);
      expect(result).toEqual({ success: true });
    });

    it('should handle error when refresh token is invalid', async () => {
      const body = { refreshToken: 'invalid-token' };
      mockAuthService.refresh.mockRejectedValue(new UnauthorizedException('Refresh token invalid'));

      await expect(controller.refresh(body)).rejects.toThrow(UnauthorizedException);

      expect(authService.refresh).toHaveBeenCalledWith(body.refreshToken);
    });
  });

  describe('requestPasswordReset', () => {
    it('should call authService.requestPasswordReset with correct email', async () => {
      const dto = { email: 'test@example.com' };
      mockAuthService.requestPasswordReset.mockResolvedValue({ success: true });

      const result = await controller.requestPasswordReset(dto);

      expect(authService.requestPasswordReset).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual({ success: true });
    });

    it('should handle 404 error when user is not found', async () => {
      const dto = { email: 'nonexistent@example.com' };
      mockAuthService.requestPasswordReset.mockRejectedValue(new HttpException('User not found', 404));

      await expect(controller.requestPasswordReset(dto)).rejects.toThrow(HttpException);

      expect(authService.requestPasswordReset).toHaveBeenCalledWith(dto.email);
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword with correct parameters', async () => {
      const dto = { 
        email: 'test@example.com', 
        code: '123456', 
        newPassword: 'newPassword' 
      };
      mockAuthService.resetPassword.mockResolvedValue({ success: true });

      const result = await controller.resetPassword(dto);

      expect(authService.resetPassword).toHaveBeenCalledWith(dto.email, dto.code, dto.newPassword);
      expect(result).toEqual({ success: true });
    });

    it('should handle 400 error when verification code is invalid', async () => {
      const dto = { 
        email: 'test@example.com', 
        code: 'invalid', 
        newPassword: 'newPassword' 
      };
      mockAuthService.resetPassword.mockRejectedValue(new HttpException('Invalid verification code', 400));

      await expect(controller.resetPassword(dto)).rejects.toThrow(HttpException);

      expect(authService.resetPassword).toHaveBeenCalledWith(dto.email, dto.code, dto.newPassword);
    });
  });
});
