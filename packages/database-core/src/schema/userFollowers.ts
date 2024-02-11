import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const userFollowers = pgTable(
  'user_followers',
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
    followerUserId: uuid('follower_user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      userIdIdx: index('user_followers_user_id_idx').on(table.userId),
      followerUserIdIdx: index('user_followers_follower_user_id_idx').on(table.followerUserId),
    };
  }
);

export const userFollowersRelations = relations(userFollowers, ({ one }) => ({
  user: one(users, {
    fields: [userFollowers.userId],
    references: [users.id],
  }),
  followerUser: one(users, {
    fields: [userFollowers.followerUserId],
    references: [users.id],
  }),
}));

export type UserFollower = typeof userFollowers.$inferSelect;

export type NewUserFollower = typeof userFollowers.$inferInsert;
