import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const moodEntries = pgTable(
  'mood_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    happinessScore: integer('happiness_score'),
    note: text('note'),
    loggedAt: timestamp('logged_at', {
      mode: 'string',
    }).notNull(),
    deletedAt: timestamp('deleted_at'),
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
      userIdIdx: index('mood_entries_user_id_idx').on(table.userId),
    };
  }
);

export const moodEntriesRelations = relations(moodEntries, ({ one }) => ({
  user: one(users, {
    fields: [moodEntries.userId],
    references: [users.id],
  }),
}));

export type MoodEntry = typeof moodEntries.$inferSelect;

export type NewMoodEntry = typeof moodEntries.$inferInsert;
