import { relations } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { ProcessingStatusEnum } from '@moaitime/shared-common';

import { users } from './users';

export const userDataExports = pgTable(
  'user_data_exports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    processingStatus: text('processing_status')
      .notNull()
      .default(ProcessingStatusEnum.PENDING)
      .$type<ProcessingStatusEnum>(),
    failedError: jsonb('failed_error'),
    exportUrl: text('export_url'),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    failedAt: timestamp('failed_at'),
    expiresAt: timestamp('expires_at'),
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
      userIdIdx: index('user_data_exports_user_id_idx').on(table.userId),
    };
  }
);

export const userDataExportsRelations = relations(userDataExports, ({ one }) => ({
  user: one(users, {
    fields: [userDataExports.userId],
    references: [users.id],
  }),
}));

export type UserDataExport = typeof userDataExports.$inferSelect;

export type NewUserDataExport = typeof userDataExports.$inferInsert;
