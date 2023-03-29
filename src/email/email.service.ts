import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sendgrid from '@sendgrid/mail';
import { ConfigVariables, SendgridConfig } from 'src/config/configuration';
import { Email } from 'src/email/email.types';

@Injectable()
export class EmailService {
  /**
   * DEFAULT_FROM is the default email address to send emails from.
   */
  static DEFAULT_FROM = 'noreply@unit00.com';

  private config: SendgridConfig;

  constructor(private readonly configService: ConfigService<ConfigVariables>) {
    this.config = configService.get<SendgridConfig>('sendgrid');
    Sendgrid.setApiKey(this.config.apiKey);
  }

  /**
   * send will send an email using the Sendgrid API.
   * @param email
   */
  async send(email: Email) {
    await Sendgrid.send({
      templateId: email.templateId,
      from: email.from || EmailService.DEFAULT_FROM,
      to: email.to,
      personalizations: [
        {
          to: {
            email: email.to,
          },
          dynamicTemplateData: {
            subject: email.subject,
            ...email.templateData,
          },
        },
      ],
    });
  }
}