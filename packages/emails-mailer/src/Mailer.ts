import type { ReactElement } from 'react';

import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';

import { TestingEmailsManager, testingEmailsManager } from '@moaitime/database-services-testing';
import {
  AuthAccountDeletionEmail,
  AuthConfirmEmailEmail,
  AuthConfirmNewEmailEmail,
  AuthPasswordChangedEmail,
  AuthResetPasswordEmail,
  AuthWelcomeEmail,
} from '@moaitime/emails-core';
import { logger, Logger } from '@moaitime/logging';
import { getEnv, MAILER_FROM } from '@moaitime/shared-backend';

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

export type MailerSendAuthPasswordChangedEmailOptions = {
  userEmail: string;
  userDisplayName: string;
};

export type MailerSendAuthAccountDeletionEmailOptions = {
  userEmail: string;
  userDisplayName: string;
  deleteAccountUrl: string;
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
      subject: '🎉 Welcome to MoaiTime!',
    });
  }

  async sendAuthConfirmEmailEmail(options: MailerSendAuthWelcomeAndConfirmEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthConfirmEmailEmail(rest), {
      to: userEmail,
      subject: '✅ Email Confirmation for MoaiTime',
    });
  }

  async sendAuthConfirmNewEmailEmail(options: MailerSendAuthWelcomeAndConfirmEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthConfirmNewEmailEmail(rest), {
      to: userEmail,
      subject: '✅ Email Conirmation for MoaiTime',
    });
  }

  async sendAuthResetPasswordEmail(options: MailerSendAuthResetPasswordEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthResetPasswordEmail(rest), {
      to: userEmail,
      subject: '🔑 Reset Password for MoaiTime',
    });
  }

  async sendAuthPasswordChangedEmail(options: MailerSendAuthPasswordChangedEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthPasswordChangedEmail(rest), {
      to: userEmail,
      subject: '🔑 Password Changed for MoaiTime',
    });
  }

  async sendAuthAccountDeletionEmail(options: MailerSendAuthAccountDeletionEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthAccountDeletionEmail(rest), {
      to: userEmail,
      subject: '😔 MoaiTime Account Deletion',
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
