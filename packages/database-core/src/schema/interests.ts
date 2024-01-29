import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const interests = pgTable(
  'interests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    parentId: uuid('parent_id'), // Relationship to self
  },
  (table) => {
    return {
      userIdIdx: index('interests_user_id_idx').on(table.userId),
      parentIdIdx: index('interests_parent_id_idx').on(table.parentId),
    };
  }
);

export const interestsRelations = relations(interests, ({ one }) => ({
  user: one(users, {
    fields: [interests.userId],
    references: [users.id],
  }),
  parent: one(interests, {
    fields: [interests.parentId],
    references: [interests.id],
  }),
}));

export type Interest = typeof interests.$inferSelect;

export type NewInterest = typeof interests.$inferInsert;
