import { relations } from 'drizzle-orm';
import { date, json, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { NoteTypeEnum } from '@moaitime/shared-common';

import { users } from './users';

export const noteTypes = pgEnum('note_types', ['note', 'journal_entry']);

export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: noteTypes('type').notNull().default(NoteTypeEnum.NOTE).$type<NoteTypeEnum>(),
  title: text('title').notNull(),
  content: json('content').notNull(),
  color: text('color'),
  directory: text('directory'),
  journalDate: date('journal_date'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export type Note = typeof notes.$inferSelect;

export type NoteWithoutContent = Omit<Note, 'content'>;

export type NewNote = typeof notes.$inferInsert;
