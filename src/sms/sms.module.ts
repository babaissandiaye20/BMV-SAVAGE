import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './twilio/twilio.service';
import { SMS_SERVICE } from './sms.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SMS_SERVICE,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      useClass: TwilioService,
    },
  ],
  exports: ['SmsServiceInterface'],
})
export class SmsModule {}
