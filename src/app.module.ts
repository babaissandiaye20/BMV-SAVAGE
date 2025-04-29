import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisService } from './redis/redis.service'; // ton service perso Redis
import { RedisModule } from '@nestjs-modules/ioredis'; // package officiel
import { ValidationService } from './validation/validation.service';
import { ExceptionService } from './validation/exception/exception.service';
import { ResponseService } from './validation/exception/response/response.service';
import { ValidationModule } from './validation/validation.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TwilioService } from './sms/twilio/twilio.service';
import { SmsModule } from './sms/sms.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
      }),
    }),
    PrismaModule,
    ValidationModule,
    UserModule,
    SmsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RedisService,
    ValidationService,
    ExceptionService,
    ResponseService,
    UserService,
    TwilioService,
  ],
})
export class AppModule {}
