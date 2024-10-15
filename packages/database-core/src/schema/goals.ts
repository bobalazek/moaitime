import { relations } from 'drizzle-orm';
import { index, integer, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const goals = pgTable(
  'goals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    order: integer('order').default(0),
    color: text('color'),
    areasOfLife: json('areas_of_life'),
    targetCompletedAt: timestamp('target_completed_at'), // What is the target date for this goal?
    completedAt: timestamp('completed_at'), // When was this goal completed?
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
      userIdIdx: index('goals_user_id_idx').on(table.userId),
    };
  }
);

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export type Goal = typeof goals.$inferSelect;

export type NewGoal = typeof goals.$inferInsert;
