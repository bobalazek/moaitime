import { relations } from 'drizzle-orm';
import { date, index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { SettingsInterface, UserRoleEnum } from '@myzenbuddy/shared-common';

import { backgrounds } from './backgrounds';
import { calendars } from './calendars';
import { greetings } from './greetings';
import { organizationUsers } from './organizationUsers';
import { quotes } from './quotes';
import { teamUsers } from './teamUsers';
import { userAccessTokens } from './userAccessTokens';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    displayName: text('display_name').notNull(),
    email: text('email').notNull().unique(),
    newEmail: text('new_email').unique(),
    beforeDeletionEmail: text('before_deletion_email'), // What was the email before the user requested deletion, in case of recovery
    password: text('password'),
    roles: json('roles')
      .notNull()
      .default(JSON.stringify([UserRoleEnum.USER]))
      .$type<UserRoleEnum[]>(),
    settings: json('settings').$type<SettingsInterface>(),
    birthDate: date('birth_date'),
    emailConfirmationToken: text('email_confirmation_token').unique(),
    newEmailConfirmationToken: text('new_email_confirmation_token').unique(),
    passwordResetToken: text('password_reset_token').unique(),
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
      emailIdx: index('email_idx').on(table.email),
      newEmailIdx: index('new_email_idx').on(table.newEmail),
      emailConfirmationTokenIdx: index('email_confirmation_token_idx').on(
        table.emailConfirmationToken
      ),
      newEmailConfirmationTokenIdx: index('new_email_confirmation_token_idx').on(
        table.newEmailConfirmationToken
      ),
      passwordResetTokenIdx: index('password_reset_token_idx').on(table.passwordResetToken),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  organizationUsers: many(organizationUsers),
  teamUsers: many(teamUsers),
  calendars: many(calendars),
  userAccessTokens: many(userAccessTokens),
  greetings: many(greetings),
  backgrounds: many(backgrounds),
  quotes: many(quotes),
}));

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;

export const selectUserSchema = createSelectSchema(users);

export const insertUserSchema = createInsertSchema(users);

export const updateUserSchema = insertUserSchema.partial();
