import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  color: text('color'),
  directory: text('directory'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
});

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export type Note = typeof notes.$inferSelect;

export type NewNote = typeof notes.$inferInsert;
