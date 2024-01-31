import { relations } from 'drizzle-orm';
import { index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { TeamUserRoleEnum } from '@moaitime/shared-common';

import { teams } from './teams';
import { users } from './users';

export const teamUserInvitations = pgTable(
  'team_user_invitations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roles: json('roles').notNull().default('[]').$type<TeamUserRoleEnum[]>(), // what roles do we want to assign that invited user
    email: text('email'), // Who are we inviting?
    expiresAt: timestamp('expires_at'),
    acceptedAt: timestamp('accepted_at'),
    rejectedAt: timestamp('rejected_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, {
        onDelete: 'cascade',
      }),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    invitedByUserId: uuid('invited_by_user_id').references(() => users.id),
  },
  (table) => {
    return {
      teamIdIdx: index('team_user_invitations_team_id_idx').on(table.teamId),
      userIdIdx: index('team_user_invitations_user_id_idx').on(table.userId),
      invitedByUserIdIdx: index('team_user_invitations_invite_by_user_id_idx').on(
        table.invitedByUserId
      ),
    };
  }
);

export const teamUserInvitationsRelations = relations(teamUserInvitations, ({ one }) => ({
  team: one(teams, {
    fields: [teamUserInvitations.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamUserInvitations.userId],
    references: [users.id],
  }),
  invitedByUser: one(users, {
    fields: [teamUserInvitations.invitedByUserId],
    references: [users.id],
  }),
}));

export type TeamUserInvitation = typeof teamUserInvitations.$inferSelect;

export type NewTeamUserInvitation = typeof teamUserInvitations.$inferInsert;