import type { ReactElement } from 'react';

import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';

import { TestingEmailsManager, testingEmailsManager } from '@myzenbuddy/database-services-testing';
import {
  AuthConfirmEmailEmail,
  AuthConfirmNewEmailEmail,
  AuthResetPasswordEmail,
  AuthWelcomeEmail,
} from '@myzenbuddy/emails-core';
import { getEnv, MAILER_FROM } from '@myzenbuddy/shared-backend';
import { logger, Logger } from '@myzenbuddy/shared-logging';

import { configureTransporter } from './Helpers';

export type MailerSendOptions = {
  to: string;
  subject: string;
};

export type MailerSendAuthWelcomeAndConfirmEmailOptions = {
  userEmail: string;
  userDisplayName: string;
  confirmEmailUrl: string;
};

export type MailerSendAuthResetPasswordEmailOptions = {
  userEmail: string;
  userDisplayName: string;
  resetPasswordUrl: string;
};

export class Mailer {
  private _transporter: nodemailer.Transporter | null = null;

  constructor(
    private _logger: Logger,
    private _testingEmailsManager: TestingEmailsManager
  ) {
    const { SMTP_URL, NODE_ENV } = getEnv();

    if (SMTP_URL && NODE_ENV !== 'test') {
      this._transporter = configureTransporter(SMTP_URL);
    }
  }

  async sendAuthWelcomeEmail(options: MailerSendAuthWelcomeAndConfirmEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthWelcomeEmail(rest), {
      to: userEmail,
      subject: '🎉 Welcome to MyZenBuddy!',
    });
  }

  async sendAuthConfirmEmailEmail(options: MailerSendAuthWelcomeAndConfirmEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthConfirmEmailEmail(rest), {
      to: userEmail,
      subject: '✅ Email Confirmation for MyZenBuddy',
    });
  }

  async sendAuthConfirmNewEmailEmail(options: MailerSendAuthWelcomeAndConfirmEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthConfirmNewEmailEmail(rest), {
      to: userEmail,
      subject: '✅ Email Conirmation for MyZenBuddy',
    });
  }

  async sendAuthResetPasswordEmail(options: MailerSendAuthResetPasswordEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthResetPasswordEmail(rest), {
      to: userEmail,
      subject: '🔑 Reset Password for MyZenBuddy',
    });
  }

  async send(Email: ReactElement, options: MailerSendOptions) {
    const html = render(Email);
    const text = render(Email, { plainText: true });

    const finalOptions = {
      from: MAILER_FROM,
      ...options,
      html,
      text,
    };

    if (getEnv().NODE_ENV === 'test') {
      await this._testingEmailsManager.insertOne({
        data: {
          ...finalOptions,
        },
      });
    }

    if (!this._transporter) {
      this._logger.warn('SMTP_URL is not set, skipping sending email');

      return;
    }

    await this._transporter.sendMail(finalOptions);
  }
}

export const mailer = new Mailer(logger, testingEmailsManager);
