import { relations } from 'drizzle-orm';
import { date, index, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { habits } from './habits';

export const habitDailyEntries = pgTable(
  'habit_daily_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    date: date('date').notNull(),
    amount: integer('goal_amount').notNull().default(0),
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
      habitIdIdx: index('habit_daily_entries_habit_id_idx').on(table.habitId),
      dateIdx: index('habit_daily_entries_date_idx').on(table.date),
    };
  }
);

export const habitDailyEntriesRelations = relations(habitDailyEntries, ({ one }) => ({
  habit: one(habits, {
    fields: [habitDailyEntries.habitId],
    references: [habits.id],
  }),
}));

export type HabitDailyEntry = typeof habitDailyEntries.$inferSelect;

export type NewHabitDailyEntry = typeof habitDailyEntries.$inferInsert;
