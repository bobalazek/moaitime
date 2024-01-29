import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tasks } from './tasks';
import { teams } from './teams';
import { users } from './users';

export const lists = pgTable(
  'lists',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    order: integer('order').default(0),
    color: text('color'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    teamId: uuid('team_id').references(() => teams.id, {
      onDelete: 'set null',
    }),
  },
  (table) => {
    return {
      userIdIdx: index('lists_user_id_idx').on(table.userId),
      teamIdIdx: index('lists_team_id_idx').on(table.teamId),
    };
  }
);

export const listsRelations = relations(lists, ({ one, many }) => ({
  user: one(users, {
    fields: [lists.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [lists.userId],
    references: [teams.id],
  }),
  tasks: many(tasks),
}));

export type List = typeof lists.$inferSelect;

export type NewList = typeof lists.$inferInsert;
