import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistTokenService } from './blacklist-token.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ResponseService } from '../../validation/exception/response/response.service';
import { createMockPrismaService } from '../../test/mocks/prisma.mock';
import { createMockResponseService } from '../../test/mocks/response.mock';

describe('BlacklistTokenService', () => {
  let service: BlacklistTokenService;
  let prismaService: PrismaService;
  let responseService: ResponseService;

  beforeEach(async () => {
    // Create mock services
    const mockPrismaService = createMockPrismaService();
    const mockResponseService = createMockResponseService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlacklistTokenService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
      ],
    }).compile();

    service = module.get<BlacklistTokenService>(BlacklistTokenService);
    prismaService = module.get<PrismaService>(PrismaService);
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('blacklist', () => {
    it('should add a token to the blacklist', async () => {
      const token = 'test-token';
      const expiresAt = new Date();

      await service.blacklist(token, expiresAt);

      expect(prismaService.blacklistedToken.create).toHaveBeenCalledWith({
        data: {
          token,
          expiresAt,
        },
      });
    });
  });

  describe('isBlacklisted', () => {
    it('should return true if token is blacklisted', async () => {
      const token = 'blacklisted-token';

      (prismaService.blacklistedToken.findUnique as jest.Mock).mockResolvedValue({
        token,
        expiresAt: new Date(),
      });

      const result = await service.isBlacklisted(token);

      expect(prismaService.blacklistedToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toBe(true);
    });

    it('should return false if token is not blacklisted', async () => {
      const token = 'non-blacklisted-token';

      (prismaService.blacklistedToken.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.isBlacklisted(token);

      expect(prismaService.blacklistedToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toBe(false);
    });
  });
});
