import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ResponseService } from '../validation/exception/response/response.service';
import { BlacklistTokenService } from './blacklist-token/blacklist-token.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { SMS_SERVICE, SmsServiceInterface } from '../sms/sms.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly blacklistService: BlacklistTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly responseService: ResponseService,
    @Inject(SMS_SERVICE)
    private readonly smsService: SmsServiceInterface,
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
        this.responseService.inactiveAccount(user.id),
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

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) {
      throw new HttpException(
        this.responseService.notFound('User not found'),
        404,
      );
    }

    // Send OTP via SMS
    await this.smsService.sendOtp(user.phone);

    return this.responseService.success(
      null,
      'Password reset code sent to your phone via SMS',
    );
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) {
      throw new HttpException(
        this.responseService.notFound('User not found'),
        404,
      );
    }

    // Verify OTP code
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.smsService.verifyOtp(user.phone, code);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (result.status !== 'approved') {
      throw new HttpException(
        this.responseService.badRequest(['Invalid verification code']),
        400,
      );
    }

    // Hash new password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: hashedPassword,
      },
    });

    return this.responseService.success(null, 'Password reset successfully');
  }
}
