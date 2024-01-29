import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const backgrounds = pgTable(
  'backgrounds',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    imageUrl: text('image_url').notNull(),
    author: text('author'),
    query: text('query'),
    url: text('url'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => {
    return {
      userIdIdx: index('backgrounds_user_id_idx').on(table.userId),
    };
  }
);

export const backgroundsRelations = relations(backgrounds, ({ one }) => ({
  user: one(users, {
    fields: [backgrounds.userId],
    references: [users.id],
  }),
}));

export type Background = typeof backgrounds.$inferSelect;

export type NewBackground = typeof backgrounds.$inferInsert;
