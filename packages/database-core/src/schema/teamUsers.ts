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
    invitedAt: timestamp('invited_at').defaultNow(),
    inviteExpiresAt: timestamp('invite_expires_at'),
    inviteAcceptedAt: timestamp('invite_accepted_at'),
    inviteRejectedAt: timestamp('invite_rejected_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      teamIdIdx: index('team_id_idx').on(table.teamId),
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);

export const teamUsersRelations = relations(teamUsers, ({ many }) => ({
  team: many(teams),
  user: many(users),
}));

export type TeamUser = typeof teamUsers.$inferSelect;

export type NewTeamUser = typeof teamUsers.$inferInsert;
