import { relations } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const userFollowedUsers = pgTable(
  'user_followed_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    followedUserId: uuid('followed_user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      userIdIdx: index('user_followed_users_user_id_idx').on(table.userId),
      followedUserIdIdx: index('user_followed_users_followed_user_id_idx').on(table.followedUserId),
    };
  }
);

export const userFollowedUsersRelations = relations(userFollowedUsers, ({ one }) => ({
  user: one(users, {
    fields: [userFollowedUsers.userId],
    references: [users.id],
  }),
  followedUser: one(users, {
    fields: [userFollowedUsers.followedUserId],
    references: [users.id],
  }),
}));

export type UserFollowedUser = typeof userFollowedUsers.$inferSelect;

export type NewUserFollowedUser = typeof userFollowedUsers.$inferInsert;
