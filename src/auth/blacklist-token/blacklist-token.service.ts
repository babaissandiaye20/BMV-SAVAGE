import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ResponseService } from '../../validation/exception/response/response.service';

@Injectable()
export class BlacklistTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private responseservice: ResponseService,
  ) {}

  async blacklist(token: string, expiresAt: Date): Promise<void> {

    await this.prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt,
      },
    });
  }


  async isBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.prisma.blacklistedToken.findUnique({
      where: { token },
    });

    return !!blacklisted;
  }
}
