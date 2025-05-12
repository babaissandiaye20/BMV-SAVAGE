import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';
import { BlacklistTokenService } from '../blacklist-token/blacklist-token.service';

describe('OptionalJwtAuthGuard', () => {
  it('should be defined', () => {
    const mockBlacklistService = {
      isBlacklisted: jest.fn(),
    } as unknown as BlacklistTokenService;

    expect(new OptionalJwtAuthGuard(mockBlacklistService)).toBeDefined();
  });
});
