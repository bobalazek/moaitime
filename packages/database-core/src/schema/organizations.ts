import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { teams } from './teams';
import { users } from './users';

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
  },
  (table) => {
    return {
      userIdIdx: index('organizations_user_id_idx').on(table.userId),
    };
  }
);

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  teams: many(teams),
  user: one(users, {
    fields: [organizations.userId],
    references: [users.id],
  }),
}));

export type Organization = typeof organizations.$inferSelect;

export type NewOrganization = typeof organizations.$inferInsert;
