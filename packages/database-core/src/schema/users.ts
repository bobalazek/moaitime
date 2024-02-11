import { relations } from 'drizzle-orm';
import { date, index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { UserRoleEnum, UserSettings } from '@moaitime/shared-common';

import { backgrounds } from './backgrounds';
import { calendars } from './calendars';
import { greetings } from './greetings';
import { interests } from './interests';
import { moodEntries } from './moodEntries';
import { organizationUsers } from './organizationUsers';
import { quotes } from './quotes';
import { teamUsers } from './teamUsers';
import { userAccessTokens } from './userAccessTokens';
import { userCalendars } from './userCalendars';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    displayName: text('display_name').notNull(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    newEmail: text('new_email').unique(),
    beforeDeletionEmail: text('before_deletion_email'), // What was the email before the user requested deletion, in case of recovery
    password: text('password'),
    roles: json('roles')
      .notNull()
      .default(JSON.stringify([UserRoleEnum.USER]))
      .$type<UserRoleEnum[]>(),
    settings: json('settings').$type<UserSettings>(),
    birthDate: date('birth_date', {
      mode: 'string',
    }),
    avatarImageUrl: text('avatar_image_url'),
    emailConfirmationToken: text('email_confirmation_token').unique(),
    newEmailConfirmationToken: text('new_email_confirmation_token').unique(),
    passwordResetToken: text('password_reset_token').unique(),
    deletionToken: text('deletion_token').unique(),
    lockedReason: text('locked_reason'),
    emailConfirmedAt: timestamp('email_confirmed_at'),
    emailConfirmationLastSentAt: timestamp('email_confirmation_last_sent_at'),
    newEmailConfirmationLastSentAt: timestamp('new_email_confirmation_last_sent_at'),
    passwordResetLastRequestedAt: timestamp('password_reset_last_requested_at'),
    lockedAt: timestamp('locked_at'),
    lockedUntilAt: timestamp('locked_until_at'),
    deletionRequestedAt: timestamp('deletion_requested_at'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      usernameIdx: index('users_username_idx').on(table.username),
      emailIdx: index('users_email_idx').on(table.email),
      newEmailIdx: index('users_new_email_idx').on(table.newEmail),
      emailConfirmationTokenIdx: index('users_email_confirmation_token_idx').on(
        table.emailConfirmationToken
      ),
      newEmailConfirmationTokenIdx: index('users_new_email_confirmation_token_idx').on(
        table.newEmailConfirmationToken
      ),
      passwordResetTokenIdx: index('users_password_reset_token_idx').on(table.passwordResetToken),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  userCalendars: many(userCalendars),
  organizationUsers: many(organizationUsers),
  teamUsers: many(teamUsers),
  calendars: many(calendars),
  userAccessTokens: many(userAccessTokens),
  greetings: many(greetings),
  backgrounds: many(backgrounds),
  quotes: many(quotes),
  interests: many(interests),
  moodEntries: many(moodEntries),
}));

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;
