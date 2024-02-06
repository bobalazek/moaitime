import { relations } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tasks } from './tasks';
import { users } from './users';

export const taskUsers = pgTable(
  'task_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, {
        onDelete: 'cascade',
      }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      taskIdIdx: index('task_users_task_id_idx').on(table.taskId),
      userIdIdx: index('task_users_user_id_idx').on(table.userId),
    };
  }
);

export const taskUsersRelations = relations(taskUsers, ({ one }) => ({
  task: one(tasks, {
    fields: [taskUsers.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskUsers.userId],
    references: [users.id],
  }),
}));

export type TaskUser = typeof taskUsers.$inferSelect;

export type NewTaskUser = typeof taskUsers.$inferInsert;
