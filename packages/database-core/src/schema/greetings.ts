import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const greetings = pgTable(
  'greetings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    text: text('text').notNull(),
    query: text('query'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => {
    return {
      userIdIdx: index('greetings_user_id_idx').on(table.userId),
    };
  }
);

export const greetingsRelations = relations(greetings, ({ one }) => ({
  user: one(users, {
    fields: [greetings.userId],
    references: [users.id],
  }),
}));

export type Greeting = typeof greetings.$inferSelect;

export type NewGreeting = typeof greetings.$inferInsert;
