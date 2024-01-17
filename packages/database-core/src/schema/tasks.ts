import { relations } from 'drizzle-orm';
import { date, integer, pgTable, text, time, timestamp, uuid } from 'drizzle-orm/pg-core';

import { lists } from './lists';
import { taskTags } from './taskTags';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  order: integer('order').default(0),
  color: text('color'),
  priority: integer('priority'),
  dueDate: date('due_date', {
    mode: 'string',
  }),
  dueDateTime: time('due_date_time'),
  dueDateTimeZone: text('due_date_time_zone'),
  durationSeconds: integer('duration_seconds'),
  completedAt: timestamp('completed_at'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  listId: uuid('list_id')
    .notNull()
    .references(() => lists.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'), // Relationship to self
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  list: one(lists, {
    fields: [tasks.listId],
    references: [lists.id],
  }),
  parent: one(tasks, {
    fields: [tasks.parentId],
    references: [tasks.id],
  }),
  children: many(tasks, {
    relationName: 'children',
  }),
  taskTags: many(taskTags),
}));

export type Task = typeof tasks.$inferSelect;

export type NewTask = typeof tasks.$inferInsert;
