import { relations } from 'drizzle-orm';
import { date, integer, pgTable, text, time, timestamp, uuid } from 'drizzle-orm/pg-core';

import { lists } from './lists';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
  description: text('description'),
  priority: integer('priority'),
  dueDate: date('due_date'),
  dueDateTime: time('due_date_time'),
  dueDateTimeZone: text('due_date_time_zone'),
  completedAt: timestamp('completed_at'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  listId: uuid('list_id')
    .notNull()
    .references(() => lists.id),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  list: one(lists, {
    fields: [tasks.listId],
    references: [lists.id],
  }),
}));

export type Task = typeof tasks.$inferSelect;

export type NewTask = typeof tasks.$inferInsert;
