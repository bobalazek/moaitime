import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email'), // Who are we inviting?
    token: text('token').unique().notNull(),
    expiresAt: timestamp('expires_at'),
    claimedAt: timestamp('claimed_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      // Who sent the invitation?
      onDelete: 'set null',
    }),
    claimedUserId: uuid('claimed_user_id').references(() => users.id), // Who is the user that was claimed the invitation?
  },
  (table) => {
    return {
      emailIdx: index('invitations_email_idx').on(table.email),
      tokenIdx: index('invitations_token_idx').on(table.token),
      userIdIdx: index('invitations_user_id_idx').on(table.userId),
      claimedUserIdIdx: index('invitations_claimed_user_id_idx').on(table.claimedUserId),
    };
  }
);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  user: one(users, {
    fields: [invitations.userId],
    references: [users.id],
  }),
  invitedUser: one(users, {
    fields: [invitations.claimedUserId],
    references: [users.id],
  }),
}));

export type Invitation = typeof invitations.$inferSelect;

export type NewInvitation = typeof invitations.$inferInsert;
