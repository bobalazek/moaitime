import { relations } from 'drizzle-orm';
import { index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tasks } from './tasks';
import { users } from './users';

export const focusSessions = pgTable(
  'focus_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskText: text('task_text'), // You can set a custom task here, instead of choosing from the list
    settings: json('settings'),
    startedAt: timestamp('started_at').defaultNow(),
    endsAt: timestamp('ends_at'), // if null, it's perpetual/lifetime
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    taskId: uuid('task_id').references(() => users.id, { onDelete: 'set null' }),
  },
  (table) => {
    return {
      userIdIdx: index('focus_sessions_user_id_idx').on(table.userId),
    };
  }
);

export const focusSessionsRelations = relations(focusSessions, ({ one }) => ({
  user: one(users, {
    fields: [focusSessions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [focusSessions.taskId],
    references: [tasks.id],
  }),
}));

export type FocusSession = typeof focusSessions.$inferSelect;

export type NewFocusSession = typeof focusSessions.$inferInsert;
