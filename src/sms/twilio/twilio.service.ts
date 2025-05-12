import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsServiceInterface } from '../sms.interface';
import twilio from 'twilio';

@Injectable()
export class TwilioService implements SmsServiceInterface {
  private client: twilio.Twilio;
  private serviceSid: string;

  constructor(private readonly config: ConfigService) {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const serviceSid = this.config.get<string>('TWILIO_SERVICE_SID');

    if (!accountSid || !authToken || !serviceSid) {
      throw new Error(
        'Twilio configuration error: please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_SERVICE_SID in your environment variables.',
      );
    }

    this.serviceSid = serviceSid;
    this.client = twilio(accountSid, authToken);
  }

  async sendOtp(phone: string) {
    return this.client.verify.v2
      .services(this.serviceSid)
      .verifications.create({ to: phone, channel: 'sms' });
  }

  async verifyOtp(phone: string, code: string) {
    return this.client.verify.v2
      .services(this.serviceSid)
      .verificationChecks.create({ to: phone, code });
  }
}
