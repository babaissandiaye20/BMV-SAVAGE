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
import { PaymentModeService } from './payment-mode/payment-mode.service';
import { PaymentModeController } from './payment-mode/payment-mode.controller';
import { PaymentModeModule } from './payment-mode/payment-mode.module';
import { UploadModule } from './upload/upload.module';
import { UploadService } from './upload/upload.service';
import { DocumentService } from './document/document.service';
import { DocumentModule } from './document/document.module';
import { PaymentModule } from './payment/payment.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AppointmentController } from './appointment/appointment.controller';
import { AppointmentService } from './appointment/appointment.service';

import { FirebaseAdminService } from './firebase/firebase-admin/firebase-admin.service';


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
    PaymentModeModule,
    UploadModule,
    DocumentModule,
    PaymentModule,
    AppointmentModule,
  ],
  controllers: [AppController, PaymentModeController, AppointmentController],
  providers: [
    AppService,
    PrismaService,
    RedisService,
    ValidationService,
    ExceptionService,
    ResponseService,
    UserService,
    TwilioService,
    PaymentModeService,
    UploadService,
    DocumentService,
    AppointmentService,
    FirebaseAdminService,
  ],
})
export class AppModule {}
