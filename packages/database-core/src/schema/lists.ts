import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { tasks } from './tasks';
import { teams } from './teams';
import { users } from './users';

export const lists = pgTable('lists', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  teamId: uuid('team_id').references(() => teams.id),
});

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

export const selectListSchema = createSelectSchema(lists);

export const insertListSchema = createInsertSchema(lists);
