import { relations } from 'drizzle-orm';
import { index, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { habits } from './habits';

export const habitEntries = pgTable(
  'habit_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    loggedAt: timestamp('logged_at').notNull().defaultNow(),
    amount: integer('amount').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    habitId: uuid('habit_id')
      .notNull()
      .references(() => habits.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      habitIdIdx: index('habit_entries_habit_id_idx').on(table.habitId),
      loggedAtIdx: index('habit_entries_logged_at_idx').on(table.loggedAt),
    };
  }
);

export const habitEntriesRelations = relations(habitEntries, ({ one }) => ({
  habit: one(habits, {
    fields: [habitEntries.habitId],
    references: [habits.id],
  }),
}));

export type HabitEntry = typeof habitEntries.$inferSelect;

export type NewHabitEntry = typeof habitEntries.$inferInsert;
