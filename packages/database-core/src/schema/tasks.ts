import { relations } from 'drizzle-orm';
import { date, index, integer, pgTable, text, time, timestamp, uuid } from 'drizzle-orm/pg-core';

import { lists } from './lists';
import { taskTags } from './taskTags';
import { users } from './users';

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    order: integer('order').default(0),
    color: text('color'),
    priority: integer('priority'),
    durationSeconds: integer('duration_seconds'),
    dueDate: date('due_date', {
      mode: 'string',
    }),
    dueDateTime: time('due_date_time'),
    dueDateTimeZone: text('due_date_time_zone'),
    dueDateRepeatPattern: text('due_date_repeat_pattern'), // the resulting pattern from rrule
    dueDateRepeatEndsAt: timestamp('due_date_repeat_ends_at'),
    completedAt: timestamp('completed_at'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    listId: uuid('list_id').references(() => lists.id, {
      onDelete: 'cascade',
    }),
    parentId: uuid('parent_id'), // Relationship to self
  },
  (table) => {
    return {
      userIdIdx: index('tasks_user_id_idx').on(table.listId),
      listIdIdx: index('tasks_list_id_idx').on(table.listId),
      parentIdIdx: index('tasks_parent_id_idx').on(table.parentId),
    };
  }
);

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
