import { relations } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import {
  FocusSessionEvent,
  FocusSessionSettings,
  FocusSessionStageEnum,
  FocusSessionStatusEnum,
} from '@moaitime/shared-common';

import { tasks } from './tasks';
import { users } from './users';

export const focusSessions = pgTable(
  'focus_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    status: text('status')
      .notNull()
      .default(FocusSessionStatusEnum.ACTIVE)
      .$type<FocusSessionStatusEnum>(),
    taskText: text('task_text').notNull(), // You can set a custom task here, instead of choosing from the list
    settings: jsonb('settings').$type<FocusSessionSettings>().notNull(),
    events: jsonb('events').$type<FocusSessionEvent[]>(),
    stage: text('stage')
      .$type<FocusSessionStageEnum>()
      .notNull()
      .default(FocusSessionStageEnum.FOCUS),
    stageIteration: integer('stage_iteration').notNull().default(1),
    stageProgressSeconds: integer('stage_progress_seconds').notNull().default(0),
    completedAt: timestamp('completed_at'),
    lastPingedAt: timestamp('last_pinged_at'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    taskId: uuid('task_id').references(() => tasks.id, {
      onDelete: 'set null',
    }),
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
