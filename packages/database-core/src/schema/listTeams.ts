import { relations } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { lists } from './lists';
import { teams } from './teams';

export const listTeams = pgTable(
  'list_teams',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    listId: uuid('list_id').references(() => lists.id, {
      onDelete: 'cascade',
    }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      listIdIdx: index('list_teams_list_id_idx').on(table.listId),
      teamIdIdx: index('list_teams_team_id_idx').on(table.teamId),
    };
  }
);

export const listTeamsRelations = relations(listTeams, ({ one }) => ({
  list: one(lists, {
    fields: [listTeams.listId],
    references: [lists.id],
  }),
  team: one(teams, {
    fields: [listTeams.teamId],
    references: [teams.id],
  }),
}));

export type ListTeam = typeof listTeams.$inferSelect;

export type NewListTeam = typeof listTeams.$inferInsert;
