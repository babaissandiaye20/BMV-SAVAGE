import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ResponseService } from '../validation/exception/response/response.service';
import { BlacklistTokenService } from './blacklist-token/blacklist-token.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly blacklistService: BlacklistTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly responseService: ResponseService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        this.responseService.unauthorized('Identifiants invalides'),
        401,
      );
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user.isPhoneVerified) {
      throw new HttpException(
        this.responseService.badRequest(
          [
            "Votre compte n'est pas encore activé. Veuillez vérifier votre numéro de téléphone.",
          ],
          'Compte inactif',
        ),
        400,
      );
    }

    const token = await this.generateToken(user.id);
    const refreshToken = await this.refreshTokenService.create(user.id);

    return this.responseService.success(
      {
        user,
        token,
        refreshToken,
      },
      'Connexion réussie',
    );
  }

  async logout(token: string) {
    const alreadyBlacklisted = await this.prisma.blacklistedToken.findUnique({
      where: { token },
    });

    if (alreadyBlacklisted) {
      throw new ConflictException(
        this.responseService.conflict('Token already blacklisted'),
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const decoded = this.jwtService.decode(token);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!decoded || typeof decoded !== 'object' || !decoded.exp) {
      throw new BadRequestException('Token invalid');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.blacklistService.blacklist(token, new Date(decoded.exp * 1000));

    return this.responseService.success(null, 'Déconnexion réussie');
  }

  async refresh(refreshToken: string) {
    const valid = await this.refreshTokenService.validate(refreshToken);

    if (!valid) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const token = await this.generateToken(valid.userId);
    const newRefresh = await this.refreshTokenService.rotate(refreshToken);

    const user = await this.prisma.user.findUnique({
      where: { id: valid.userId },
    });

    return this.responseService.success(
      {
        user,
        token,
        refreshToken: newRefresh.token,
      },
      'Token rafraîchi',
    );
  }

  private async generateToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId });
  }
}
