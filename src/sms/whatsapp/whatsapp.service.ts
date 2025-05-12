import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsServiceInterface } from '../sms.interface';
import twilio from 'twilio';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class WhatsAppService implements SmsServiceInterface {
  private client: twilio.Twilio;
  private fromNumber: string;
  private readonly OTP_EXPIRATION_TIME = 10 * 60; // 10 minutes in seconds

  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
  ) {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const fromNumber = this.config.get<string>('WHATSAPP_FROM_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error(
        'WhatsApp configuration error: please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and WHATSAPP_FROM_NUMBER in your environment variables.',
      );
    }

    this.fromNumber = fromNumber;
    this.client = twilio(accountSid, authToken);
  }

  async sendOtp(phone: string): Promise<any> {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code in Redis with expiration
    const redisKey = `otp:${phone}`;
    await this.redisService.set(redisKey, code, this.OTP_EXPIRATION_TIME);

    // Check if the phone number is the same as the fromNumber
    if (phone === this.fromNumber) {
      console.log(`Cannot send WhatsApp message to the same number as the sender (${phone}). Code stored in Redis.`);
      // Return a mock successful response without actually sending the message
      return {
        sid: 'MOCK_SID',
        status: 'delivered',
        body: `Your verification code is: ${code}`,
      };
    }

    // Send the code via WhatsApp
    return this.client.messages.create({
      body: `Your verification code is: ${code}`,
      from: `whatsapp:${this.fromNumber}`,
      to: `whatsapp:${phone}`
    });
  }

  async verifyOtp(phone: string, code: string): Promise<any> {
    const redisKey = `otp:${phone}`;
    const storedCode = await this.redisService.get(redisKey);

    // Check if the code matches the stored code
    if (storedCode && storedCode === code) {
      // Clear the code after successful verification
      await this.redisService.del(redisKey);
      return { status: 'approved' };
    }

    return { status: 'rejected' };
  }
}
