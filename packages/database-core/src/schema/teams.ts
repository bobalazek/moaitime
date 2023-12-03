import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { organizations } from './organizations';

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
});

export const teamsRelations = relations(teams, ({ one }) => ({
  organization: one(organizations, {
    fields: [teams.organizationId],
    references: [organizations.id],
  }),
}));

export type Team = typeof teams.$inferSelect;

export type NewTeam = typeof teams.$inferInsert;

export const selectTeamSchema = createSelectSchema(teams);

export const insertTeamSchema = createInsertSchema(teams);
