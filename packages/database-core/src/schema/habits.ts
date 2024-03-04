import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { HabitGoalFrequencyEnum } from '@moaitime/shared-common';

import { users } from './users';

export const habits = pgTable(
  'habits',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    order: integer('order').default(0),
    color: text('color'),
    priority: integer('priority'),
    goalAmount: integer('goal_amount').notNull().default(1),
    goalUnit: text('goal_unit').notNull().default('times'),
    goalFrequency: text('goal_frequency').notNull().default('day').$type<HabitGoalFrequencyEnum>(), // day, week, month, year
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
      userIdIdx: index('habits_user_id_idx').on(table.userId),
    };
  }
);

export const habitsRelations = relations(habits, ({ one }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
}));

export type Habit = typeof habits.$inferSelect;

export type NewHabit = typeof habits.$inferInsert;
