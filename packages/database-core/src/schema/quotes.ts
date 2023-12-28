import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const quotes = pgTable('quotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  author: text('author'),
  query: text('query'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const quotesRelations = relations(quotes, ({ one }) => ({
  user: one(users, {
    fields: [quotes.userId],
    references: [users.id],
  }),
}));

export type Quote = typeof quotes.$inferSelect;

export type NewQuote = typeof quotes.$inferInsert;
