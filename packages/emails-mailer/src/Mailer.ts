import type { ReactElement } from 'react';

import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';

import { TestingEmailsManager, testingEmailsManager } from '@moaitime/database-services-testing';
import {
  AuthAccountDeletionEmail,
  AuthConfirmEmailEmail,
  AuthConfirmNewEmailEmail,
  AuthPasswordChangedEmail,
  AuthPasswordlessLoginEmail,
  AuthResetPasswordEmail,
  AuthWelcomeEmail,
  SocialUserInvitationEmail,
  TeamsUserInvitationEmail,
} from '@moaitime/emails-core';
import { logger, Logger } from '@moaitime/logging';
import { getEnv } from '@moaitime/shared-backend';

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

export type MailerSendAuthPasswordlessLoginEmailOptions = {
  userEmail: string;
  userDisplayName: string;
  passwordlessLoginUrl: string;
  code: string;
};

export type MailerSendAuthAccountDeletionEmailOptions = {
  userEmail: string;
  userDisplayName: string;
  deleteAccountUrl: string;
};

export type MailerSendTeamsUserInvitationEmailOptions = {
  userEmail: string;
  invitedByUserDisplayName: string;
  teamName: string;
  registerUrl: string;
};

export type MailerSendSocialUserInvitationEmailOptions = {
  userEmail: string;
  invitedByUserDisplayName: string;
  registerUrl: string;
};

export class Mailer {
  private _nodemailerTransporter: nodemailer.Transporter | null = null;
  private _resend: Resend | null = null;

  constructor(
    private _logger: Logger,
    private _testingEmailsManager: TestingEmailsManager
  ) {
    const { NODE_ENV, MAILER_SMTP_URL, MAILER_RESEND_API_KEY } = getEnv();

    if (NODE_ENV !== 'test') {
      if (MAILER_SMTP_URL) {
        this._nodemailerTransporter = configureTransporter(decodeURIComponent(MAILER_SMTP_URL));
      }

      if (MAILER_RESEND_API_KEY) {
        this._resend = new Resend(MAILER_RESEND_API_KEY);
      }
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

  async sendAuthPasswordlessLoginEmail(options: MailerSendAuthPasswordlessLoginEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthPasswordlessLoginEmail(rest), {
      to: userEmail,
      subject: '🪄 Magic Login for MoaiTime',
    });
  }

  async sendAuthAccountDeletionEmail(options: MailerSendAuthAccountDeletionEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(AuthAccountDeletionEmail(rest), {
      to: userEmail,
      subject: '😔 MoaiTime Account Deletion',
    });
  }

  async sendTeamsUserInvitationEmail(options: MailerSendTeamsUserInvitationEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(TeamsUserInvitationEmail(rest), {
      to: userEmail,
      subject: '📨 MoaiTime Team Invitation',
    });
  }

  async sendSocialUserInvitationEmail(options: MailerSendSocialUserInvitationEmailOptions) {
    const { userEmail, ...rest } = options;

    return this.send(SocialUserInvitationEmail(rest), {
      to: userEmail,
      subject: '📨 MoaiTime Invitation',
    });
  }

  async send(Email: ReactElement, options: MailerSendOptions) {
    const { MAILER_FROM } = getEnv();

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

    let emailSent = false;
    if (this._resend) {
      this._logger.debug(
        `Sending email to ${finalOptions.to} with subject "${finalOptions.subject}" (via Resend) ...`
      );

      const result = await this._resend.emails.send(finalOptions);

      this._logger.debug(
        `Email to ${finalOptions.to} with subject "${finalOptions.subject}" was sent via Resend (result: ${JSON.stringify(result)}).`
      );

      emailSent = true;
    }

    if (this._nodemailerTransporter) {
      if (emailSent) {
        this._logger.debug(
          `Email to ${finalOptions.to} with subject "${finalOptions.subject}" was already sent via Resend, skipping SMTP ...`
        );

        return;
      }

      this._logger.debug(
        `Sending email to ${finalOptions.to} with subject "${finalOptions.subject}" (via SMTP) ...`
      );

      await this._nodemailerTransporter.sendMail(finalOptions);

      this._logger.debug(
        `Email to ${finalOptions.to} with subject "${finalOptions.subject}" was sent via SMTP.`
      );
    }
  }
}

export const mailer = new Mailer(logger, testingEmailsManager);
