import { relations } from 'drizzle-orm';
import { date, index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { NoteTypeEnum } from '@moaitime/shared-common';

import { users } from './users';

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: text('type').notNull().default(NoteTypeEnum.NOTE).$type<NoteTypeEnum>(),
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
  },
  (table) => {
    return {
      userIdIdx: index('notes_user_id_idx').on(table.userId),
    };
  }
);

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export type Note = typeof notes.$inferSelect;

export type NoteWithoutContent = Omit<Note, 'content'>;

export type NewNote = typeof notes.$inferInsert;
