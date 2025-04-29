import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { BlacklistTokenService } from '../blacklist-token/blacklist-token.service';
import { ResponseService } from '../../validation/exception/response/response.service';
@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly blacklistService: BlacklistTokenService,
    private readonly reflector: Reflector,
    private readonly responseService: ResponseService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      this.responseService.unauthorized('No token provided');
    }

    const blacklisted = await this.blacklistService.isBlacklisted(token);
    if (blacklisted) {
      this.responseService.unauthorized('Token is blacklisted');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return super.canActivate(context) as Promise<boolean>;
  }
}
