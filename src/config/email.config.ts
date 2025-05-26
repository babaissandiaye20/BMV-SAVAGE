// config/email.config.ts
import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const emailConfig = {
  useFactory: async (config: ConfigService): Promise<MailerOptions> => ({
    transport: {
      host: config.get<string>('EMAIL_HOST'),
      port: config.get<number>('EMAIL_PORT'),
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: config.get<string>('USERNAME_EMAIL'),
        pass: config.get<string>('PASSWORD_EMAIL'),
      },
    },
    defaults: {
      from: config.get<string>('FROM'),
    },
    // Template configuration - optionnel
    template: {
      dir: join(__dirname, '..', 'templates'), // Créez ce dossier si vous voulez des templates
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
    // Options pour permettre l'envoi sans template
    options: {
      partials: {
        dir: join(__dirname, '..', 'templates', 'partials'),
        options: {
          strict: true,
        },
      },
    },
  }),
  inject: [ConfigService],
};