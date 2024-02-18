import { relations } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const userAccessTokens = pgTable(
  'user_access_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').notNull().unique(),
    userAgent: text('user_agent'),
    userAgentParsed: jsonb('user_agent_parsed'),
    deviceUid: text('device_uid'), // did not use "_id" because that would imply an entity of a table
    revokedReason: text('revoked_reason'),
    refreshToken: text('refresh_token').notNull().unique(),
    refreshTokenClaimedAt: timestamp('refresh_token_claimed_at'),
    revokedAt: timestamp('revoked_at'),
    expiresAt: timestamp('expires_at'),
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
      userIdIdx: index('user_access_tokens_user_id_idx').on(table.userId),
    };
  }
);

export const userAccessTokensRelations = relations(userAccessTokens, ({ one }) => ({
  user: one(users, {
    fields: [userAccessTokens.userId],
    references: [users.id],
  }),
}));

export type UserAccessToken = typeof userAccessTokens.$inferSelect;

export type NewUserAccessToken = typeof userAccessTokens.$inferInsert;
