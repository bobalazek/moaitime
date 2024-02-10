import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const feedbackEntries = pgTable(
  'feedback_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
  },
  (table) => {
    return {
      userIdIdx: index('feedback_entries_user_id_idx').on(table.userId),
    };
  }
);

export const feedbackEntriesRelations = relations(feedbackEntries, ({ one }) => ({
  user: one(users, {
    fields: [feedbackEntries.userId],
    references: [users.id],
  }),
}));

export type FeedbackEntry = typeof feedbackEntries.$inferSelect;

export type NewFeedbackEntry = typeof feedbackEntries.$inferInsert;
