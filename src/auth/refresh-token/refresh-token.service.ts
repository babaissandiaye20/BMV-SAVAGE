import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { addDays } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(userId: string): Promise<{ token: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const token = uuid();
    const days = parseInt(
      this.config.get<string>('JWT_REFRESH_EXPIRES_DAYS', '7'),
    );

    await this.prisma.refreshToken.create({
      data: {
        userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        token,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        expiresAt: addDays(new Date(), days),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { token };
  }

  async validate(token: string): Promise<{ userId: string } | null> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      return null;
    }

    return { userId: stored.userId };
  }

  async rotate(oldToken: string): Promise<{ token: string }> {
    const existing = await this.prisma.refreshToken.findUnique({
      where: { token: oldToken },
    });

    if (!existing || existing.revoked || existing.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { token: oldToken },
      data: { revoked: true },
    });

    return this.create(existing.userId);
  }
}
