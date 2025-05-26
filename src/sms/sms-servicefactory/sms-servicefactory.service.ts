import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsServiceInterface } from '../sms.interface';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';

@Injectable()
export class SmsServicefactoryService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService,
  ) {}

  /**
   * Crée et retourne l'instance du service SMS approprié selon la configuration
   */
  createSmsService(): SmsServiceInterface {
    const provider = this.configService.get<string>('SMS_PROVIDER', 'email');

    switch (provider.toLowerCase()) {
      case 'twilio':
        return this.twilioService;
      case 'email':
        return this.emailService;
      default:
        // Par défaut, utiliser le service email
        console.warn(`Provider SMS non reconnu: ${provider}. Utilisation du service email par défaut.`);
        return this.emailService;
    }
  }

  /**
   * Méthode utilitaire pour envoyer un OTP via le service approprié
   */
  async sendOtp(phone: string): Promise<any> {
    const smsService = this.createSmsService();
    return await smsService.sendOtp(phone);
  }

  /**
   * Méthode utilitaire pour vérifier un OTP via le service approprié
   */
  async verifyOtp(phone: string, code: string): Promise<any> {
    const smsService = this.createSmsService();
    return await smsService.verifyOtp(phone, code);
  }

  /**
   * Retourne le type de provider actuellement configuré
   */
  getCurrentProvider(): string {
    return this.configService.get<string>('SMS_PROVIDER', 'email');
  }

  /**
   * Vérifie si la configuration du provider est valide
   */
  validateProviderConfig(): boolean {
    const provider = this.getCurrentProvider();

    switch (provider.toLowerCase()) {
      case 'twilio':
        return this.validateTwilioConfig();
      case 'email':
        return this.validateEmailConfig();
      default:
        return false;
    }
  }

  private validateTwilioConfig(): boolean {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const serviceSid = this.configService.get<string>('TWILIO_SERVICE_SID');

    return !!(accountSid && authToken && serviceSid);
  }

  private validateEmailConfig(): boolean {
    const emailHost = this.configService.get<string>('EMAIL_HOST');
    const emailPort = this.configService.get<string>('EMAIL_PORT');
    const username = this.configService.get<string>('USERNAME_EMAIL');
    const password = this.configService.get<string>('PASSWORD_EMAIL');

    return !!(emailHost && emailPort && username && password);
  }
}