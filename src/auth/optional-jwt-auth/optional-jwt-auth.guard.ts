import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlacklistTokenService } from '../blacklist-token/blacklist-token.service';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly blacklistService: BlacklistTokenService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return true; // Autoriser la requête même sans token
    }

    const blacklisted = await this.blacklistService.isBlacklisted(token);
    if (blacklisted) return true; // Autoriser mais pas authentifié

    return super.canActivate(context) as Promise<boolean>;
  }
}
