import { relations } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userAchievements } from './userAchievements';

export const userAchievementEntries = pgTable(
  'user_achievement_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    // This will be an indexed field so we can quickly query if we additionally create a new entry or not,
    // so we can avoid creating multiple entries for the same achievement.
    // This will possibly be a simple key such as "tasks:12345" or if per day,
    // then it will look like "tasks:12345:2021-01-01".
    key: text('key').notNull(),
    points: integer('points').notNull(),
    data: jsonb('data'), // what was the reason we got the points for the achievement?
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userAchievementId: uuid('user_achievement_id')
      .notNull()
      .references(() => userAchievements.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      keyIdx: index('user_achievement_entries_key_idx').on(table.key),
      userAchievementIdIdx: index('user_achievement_entries_user_achievement_id_idx').on(
        table.userAchievementId
      ),
    };
  }
);

export const userAchievementEntriesRelations = relations(userAchievementEntries, ({ one }) => ({
  user: one(userAchievements, {
    fields: [userAchievementEntries.userAchievementId],
    references: [userAchievements.id],
  }),
}));

export type UserAchievementEntry = typeof userAchievementEntries.$inferSelect;

export type NewUserAchievementEntry = typeof userAchievementEntries.$inferInsert;
