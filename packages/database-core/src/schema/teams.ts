import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { organizations } from './organizations';
import { users } from './users';

export const teams = pgTable(
  'teams',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    organizationId: uuid('organization_id').references(() => organizations.id, {
      onDelete: 'set null',
    }),
  },
  (table) => {
    return {
      userIdIdx: index('teams_user_id_idx').on(table.userId),
      organizationIdIdx: index('teams_organization_id_idx').on(table.organizationId),
    };
  }
);

export const teamsRelations = relations(teams, ({ one }) => ({
  user: one(users, {
    fields: [teams.organizationId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [teams.organizationId],
    references: [organizations.id],
  }),
}));

export type Team = typeof teams.$inferSelect;

export type NewTeam = typeof teams.$inferInsert;
