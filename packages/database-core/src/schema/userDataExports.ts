import { relations } from 'drizzle-orm';
import { json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { ProcessingStatusEnum } from '@moaitime/shared-common';

import { processingStatusEnum } from './enums';
import { users } from './users';

export const userDataExports = pgTable('user_data_exports', {
  id: uuid('id').defaultRandom().primaryKey(),
  processingStatus: processingStatusEnum('processing_status')
    .notNull()
    .default(ProcessingStatusEnum.PENDING)
    .$type<ProcessingStatusEnum>(),
  failedError: json('failed_error'),
  exportUrl: text('export_url'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  failedAt: timestamp('failed_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const userDataExportsRelations = relations(userDataExports, ({ one }) => ({
  user: one(users, {
    fields: [userDataExports.userId],
    references: [users.id],
  }),
}));

export type UserDataExport = typeof userDataExports.$inferSelect;

export type NewUserDataExport = typeof userDataExports.$inferInsert;
