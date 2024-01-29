import { relations } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tags } from './tags';
import { tasks } from './tasks';

export const taskTags = pgTable(
  'task_tags',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, {
        onDelete: 'cascade',
      }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      taskIdIdx: index('task_tags_task_id_idx').on(table.taskId),
      tagIdIdx: index('task_tags_tag_id_idx').on(table.tagId),
    };
  }
);

export const taskTagsRelations = relations(taskTags, ({ many }) => ({
  task: many(tasks),
  tag: many(tags),
}));

export type TaskTag = typeof taskTags.$inferSelect;

export type NewTaskTag = typeof taskTags.$inferInsert;
