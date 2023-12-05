import type { ReactElement } from 'react';

import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';

import { AuthWelcomeEmail } from '@myzenbuddy/emails-core';
import { getEnv } from '@myzenbuddy/shared-backend';

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
  private _transporter: nodemailer.Transporter;

  constructor() {
    const { SMTP_URL } = getEnv();

    this._transporter = nodemailer.createTransport(SMTP_URL);
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

    await this._transporter.sendMail({
      from: 'My Zen Buddy <mailer@corcosoft.com>',
      ...options,
      html,
      text,
    });
  }
}

export const mailer = new Mailer();
