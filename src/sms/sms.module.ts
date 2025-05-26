import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TwilioService } from './twilio/twilio.service';
import { EmailService } from './email/email.service';
import { RedisService } from '../redis/redis.service';
import { SMS_SERVICE } from './sms.interface';
import { emailConfig } from '../config/email.config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      ...emailConfig,
    }),
  ],
  providers: [
    RedisService,
    TwilioService,
    EmailService,
    {
      provide: SMS_SERVICE,
      useFactory: (
        configService: ConfigService,
        emailService: EmailService,
        twilioService: TwilioService,
      ) => {
        const provider = configService.get<string>('SMS_PROVIDER', 'email');
        console.log(`SMS Provider configuré: ${provider}`);
        return provider === 'twilio' ? twilioService : emailService;
      },
      inject: [ConfigService, EmailService, TwilioService],
    },
  ],
  exports: [SMS_SERVICE, RedisService, EmailService, TwilioService],
})
export class SmsModule {}