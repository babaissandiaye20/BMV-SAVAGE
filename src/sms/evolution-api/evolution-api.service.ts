import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsServiceInterface } from '../sms.interface';
import { RedisService } from '../../redis/redis.service';
import axios from 'axios';

@Injectable()
export class EvolutionApiService implements SmsServiceInterface {
  private readonly baseUrl: string;
  private readonly instanceName: string;
  private readonly apiKey: string;
  private readonly fromNumber: string;
  private readonly OTP_EXPIRATION_TIME = 10 * 60; // 10 minutes in seconds

  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
  ) {
    const baseUrl = this.config.get<string>('EVOLUTION_API_BASE_URL');
    const instanceName = this.config.get<string>('EVOLUTION_API_INSTANCE');
    const apiKey = this.config.get<string>('EVOLUTION_API_KEY');
    const fromNumber = this.config.get<string>('WHATSAPP_FROM_NUMBER');

    if (!baseUrl || !instanceName || !apiKey || !fromNumber) {
      throw new Error(
        'Evolution API configuration error: please check EVOLUTION_API_BASE_URL, EVOLUTION_API_INSTANCE, EVOLUTION_API_KEY, and WHATSAPP_FROM_NUMBER in your environment variables.',
      );
    }

    this.baseUrl = baseUrl;
    this.instanceName = instanceName;
    this.apiKey = apiKey;
    this.fromNumber = fromNumber;
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

    // Format phone numbers (remove '+' if present)
    const formattedFromNumber = this.fromNumber.startsWith('+') 
      ? this.fromNumber.substring(1) 
      : this.fromNumber;
    
    const formattedToNumber = phone.startsWith('+') 
      ? phone.substring(1) 
      : phone;

    try {
      // Send the code via Evolution API
      const response = await axios.post(
        `${this.baseUrl}/message/sendText/${this.instanceName}`,
        {
          number: formattedToNumber,
          textMessage: `Your verification code is: ${code}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey,
          },
        },
      );

      return {
        sid: response.data?.key?.id || 'UNKNOWN_SID',
        status: response.data?.status || 'sent',
        body: `Your verification code is: ${code}`,
      };
    } catch (error) {
      console.error('Error sending WhatsApp message via Evolution API:', error);
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
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