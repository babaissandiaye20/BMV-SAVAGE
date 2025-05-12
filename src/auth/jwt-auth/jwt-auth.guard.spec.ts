import { JwtAuthGuard } from './jwt-auth.guard';
import { BlacklistTokenService } from '../blacklist-token/blacklist-token.service';
import { Reflector } from '@nestjs/core';
import { ResponseService } from '../../validation/exception/response/response.service';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const mockBlacklistService = {
      isBlacklisted: jest.fn(),
    } as unknown as BlacklistTokenService;

    const mockReflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    const mockResponseService = {
      unauthorized: jest.fn(),
    } as unknown as ResponseService;

    expect(new JwtAuthGuard(
      mockBlacklistService,
      mockReflector,
      mockResponseService
    )).toBeDefined();
  });
});
