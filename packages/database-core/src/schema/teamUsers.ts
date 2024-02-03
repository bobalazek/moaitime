import { relations } from 'drizzle-orm';
import { index, json, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { TeamUserRoleEnum } from '@moaitime/shared-common';

import { teams } from './teams';
import { users } from './users';

export const teamUsers = pgTable(
  'team_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roles: json('roles').notNull().default('[]').$type<TeamUserRoleEnum[]>(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, {
        onDelete: 'cascade',
      }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      teamIdIdx: index('team_users_team_id_idx').on(table.teamId),
      userIdIdx: index('team_users_user_id_idx').on(table.userId),
    };
  }
);

export const teamUsersRelations = relations(teamUsers, ({ one }) => ({
  team: one(teams, {
    fields: [teamUsers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamUsers.userId],
    references: [users.id],
  }),
}));

export type TeamUser = typeof teamUsers.$inferSelect;

export type NewTeamUser = typeof teamUsers.$inferInsert;
