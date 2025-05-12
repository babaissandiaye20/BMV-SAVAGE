import { BlacklistTokenService } from '../../auth/blacklist-token/blacklist-token.service';

// Create a mock BlacklistTokenService that can be used in tests
export const createMockBlacklistTokenService = () => {
  return {
    blacklist: jest.fn().mockImplementation(async (token: string, expiresAt: Date) => {
      return Promise.resolve();
    }),
    
    isBlacklisted: jest.fn().mockImplementation(async (token: string) => {
      return Promise.resolve(false);
    }),
  } as unknown as BlacklistTokenService;
};