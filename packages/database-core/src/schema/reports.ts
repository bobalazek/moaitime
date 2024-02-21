import { relations } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { Entity } from '@moaitime/shared-common';

import { users } from './users';

export const reports = pgTable(
  'reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    targetEntity: jsonb('target_entity').notNull().$type<Entity>(),
    data: jsonb('data'),
    tags: jsonb('tags').default('[]').$type<string[]>(),
    acknowledgedAt: timestamp('acknowledged_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
  },
  (table) => {
    return {
      userIdIdx: index('reports_user_id_idx').on(table.userId),
    };
  }
);

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

export type Report = typeof reports.$inferSelect;

export type NewReport = typeof reports.$inferInsert;
