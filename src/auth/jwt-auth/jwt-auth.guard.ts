// src/auth/jwt-auth/jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { BlacklistTokenService } from '../blacklist-token/blacklist-token.service';
import { ResponseService } from '../../validation/exception/response/response.service';
import { IS_PUBLIC_KEY } from '../../common/decorator/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly blacklistService: BlacklistTokenService,
    private readonly reflector: Reflector,
    private readonly responseService: ResponseService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException(
        this.responseService.unauthorized('Aucun token fourni'),
      );
    }

    const blacklisted = await this.blacklistService.isBlacklisted(token);
    if (blacklisted) {
      throw new UnauthorizedException(
        this.responseService.unauthorized('Token blacklisté'),
      );
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
