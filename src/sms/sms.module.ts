import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './twilio/twilio.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';
import { EvolutionApiService } from './evolution-api/evolution-api.service';
import { SMS_SERVICE } from './sms.interface';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SMS_SERVICE,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      useClass: TwilioService,
    },
    RedisService,
    TwilioService,
    EvolutionApiService,
  ],
  exports: [SMS_SERVICE],
})
export class SmsModule {}
