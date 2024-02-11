import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const userBlockedUsers = pgTable(
  'user_blocked_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    color: text('color'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    blockedUserId: uuid('blocked_user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      userIdIdx: index('user_blocked_users_user_id_idx').on(table.userId),
      blockedUserIdIdx: index('user_block_users_blocked_user_id_idx').on(table.blockedUserId),
    };
  }
);

export const userBlockedUsersRelations = relations(userBlockedUsers, ({ one }) => ({
  user: one(users, {
    fields: [userBlockedUsers.userId],
    references: [users.id],
  }),
  blockedUser: one(users, {
    fields: [userBlockedUsers.blockedUserId],
    references: [users.id],
  }),
}));

export type UserBlockedUser = typeof userBlockedUsers.$inferSelect;

export type NewUserBlockedUser = typeof userBlockedUsers.$inferInsert;
