import { relations } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const userActivityEntries = pgTable(
  'user_activity_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    lastActiveAt: timestamp('last_active_at').defaultNow(),
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
      userIdIdx: index('user_activity_entries_user_id_idx').on(table.userId),
    };
  }
);

export const userActivityEntriesRelations = relations(userActivityEntries, ({ one }) => ({
  user: one(users, {
    fields: [userActivityEntries.userId],
    references: [users.id],
  }),
}));

export type UserActivityEntry = typeof userActivityEntries.$inferSelect;

export type NewUserActivityEntry = typeof userActivityEntries.$inferInsert;
