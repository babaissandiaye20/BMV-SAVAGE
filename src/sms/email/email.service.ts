import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { SmsServiceInterface } from '../sms.interface';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class EmailService implements SmsServiceInterface {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async sendOtp(phone: string): Promise<any> {
    // Supposons que 'phone' contient une adresse email
    const email = phone;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`💾 [Redis SET] otp:${email}`);
    await this.redisService.set(`otp:${email}`, otp, 300);

    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('FROM'),
        subject: 'Votre code de vérification',
        text: `Votre code de vérification est : ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Code de vérification</h2>
            <p>Votre code de vérification est :</p>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h1 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 3px;">${otp}</h1>
            </div>
            <p style="color: #666;">Ce code expire dans 5 minutes.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">
              Ceci est un message automatique, merci de ne pas répondre.
            </p>
          </div>
        `,
        // Explicitly disable template processing
        template: undefined,
      });

      console.log(`✅ OTP envoyé avec succès à: ${email}`);
      return { status: 'sent', message: 'OTP sent to email' };
    } catch (error) {
      console.error(`❌ Erreur envoi email à ${email}:`, error);
      throw error;
    }
  }

  async verifyOtp(phone: string, code: string): Promise<any> {
    // Supposons que 'phone' contient une adresse email
    const email = phone;
    console.log(`🔍 [Redis GET] otp:${email}`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const storedOtp = await this.redisService.get(`otp:${email}`);

    if (!storedOtp) {
      console.log(`❌ OTP not found or expired for: ${email}`);
      throw new Error('OTP expired or not found');
    }

    if (storedOtp === code) {
      console.log(`✅ OTP verified successfully for: ${email}`);
      await this.redisService.del(`otp:${email}`);
      return { status: 'approved', message: 'OTP verified successfully' };
    } else {
      console.log(`❌ Invalid OTP for: ${email}. Expected: ${storedOtp}, Got: ${code}`);
      return { status: 'rejected', message: 'Invalid OTP' };
    }
  }
}