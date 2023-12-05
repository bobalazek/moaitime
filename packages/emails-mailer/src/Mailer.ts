import type { ReactElement } from 'react';

import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';

import { AuthWelcomeEmail } from '@myzenbuddy/emails-core';
import { getEnv, MAILER_FROM } from '@myzenbuddy/shared-backend';
import { logger, Logger } from '@myzenbuddy/shared-logging';

import { configureTransporter } from './Helpers';

export type MailerSendOptions = {
  to: string;
  subject: string;
};

export type MailerSendAuthWelcomeEmailOptions = {
  userEmail: string;
  userDisplayName: string;
  verifyEmailUrl: string;
};

export class Mailer {
  private _transporter: nodemailer.Transporter | null = null;

  constructor(private _logger: Logger) {
    const { SMTP_URL, NODE_ENV } = getEnv();

    if (SMTP_URL && NODE_ENV !== 'test') {
      this._transporter = configureTransporter(SMTP_URL);
    }
  }

  async sendAuthWelcomeEmail(options: MailerSendAuthWelcomeEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthWelcomeEmail(rest), {
      to: userEmail,
      subject: 'Welcome to MyZenBuddy!',
    });
  }

  async send(Email: ReactElement, options: MailerSendOptions) {
    const html = render(Email);
    const text = render(Email, { plainText: true });

    if (!this._transporter) {
      this._logger.warn('SMTP_URL is not set, skipping sending email');

      return;
    }

    await this._transporter.sendMail({
      from: MAILER_FROM,
      ...options,
      html,
      text,
    });
  }
}

export const mailer = new Mailer(logger);
