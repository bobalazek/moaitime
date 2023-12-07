import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { lists } from './lists';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
  description: text('description'),
  priority: integer('priority'),
  dueAt: timestamp('due_at'),
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

export const selectTaskSchema = createSelectSchema(tasks);

export const insertTaskSchema = createInsertSchema(tasks);

export const updateTaskSchema = insertTaskSchema.partial();
