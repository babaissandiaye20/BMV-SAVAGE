// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { BlacklistTokenService } from './blacklist-token/blacklist-token.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    BlacklistTokenService,
    RefreshTokenService,
    ResponseService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 👈 Guard global ici
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
