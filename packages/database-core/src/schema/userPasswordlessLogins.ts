import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { UserPasswordlessLoginTypeEnum } from '@moaitime/shared-common';

import { users } from './users';

export const userPasswordlessLogins = pgTable(
  'user_passwordless_logins',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: text('type')
      .notNull()
      .default(UserPasswordlessLoginTypeEnum.EMAIL)
      .$type<UserPasswordlessLoginTypeEnum>(),
    token: text('token').notNull().unique(), // UUID, so the user can check the status of the token
    code: text('code').notNull(), // The actual 4-6 digit code
    expiresAt: timestamp('expires_at'),
    approvedAt: timestamp('approved_at'),
    rejectedAt: timestamp('rejected_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      userIdIdx: index('user_passwordless_logins_user_id_idx').on(table.userId),
      tokenIdx: index('user_passwordless_logins_token_idx').on(table.userId),
    };
  }
);

export const userPasswordlessLoginsRelations = relations(userPasswordlessLogins, ({ one }) => ({
  user: one(users, {
    fields: [userPasswordlessLogins.userId],
    references: [users.id],
  }),
}));

export type UserPasswordlessLogin = typeof userPasswordlessLogins.$inferSelect;

export type NewUserPasswordlessLogin = typeof userPasswordlessLogins.$inferInsert;
