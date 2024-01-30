import { addDays } from 'date-fns';
import { and, count, DBQueryConfig, desc, eq, gt, isNull, or } from 'drizzle-orm';

import {
  getDatabase,
  NewTeam,
  Team,
  teams,
  TeamUser,
  TeamUserInvitation,
  teamUserInvitations,
  teamUsers,
  users,
} from '@moaitime/database-core';
import { mailer } from '@moaitime/emails-mailer';
import { TeamUserRoleEnum, WEB_URL } from '@moaitime/shared-common';

export class TeamsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Team[]> {
    return getDatabase().query.teams.findMany(options);
  }

  async findOneById(id: string): Promise<Team | null> {
    const row = await getDatabase().query.teams.findFirst({
      where: eq(teams.id, id),
    });

    return row ?? null;
  }

  async findManyByUserId(userId: string): Promise<Team[]> {
    return getDatabase().query.teams.findMany({
      where: and(eq(teams.userId, userId), isNull(teams.deletedAt)),
      orderBy: desc(teams.name),
    });
  }

  async insertOne(data: NewTeam): Promise<Team> {
    const rows = await getDatabase().insert(teams).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewTeam>): Promise<Team> {
    const rows = await getDatabase()
      .update(teams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();

    return rows[0];
  }

  async updateOneByUserId(userId: string, data: Partial<NewTeam>): Promise<Team> {
    const rows = await getDatabase()
      .update(teams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teams.userId, userId))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Team> {
    const rows = await getDatabase().delete(teams).where(eq(teams.id, id)).returning();

    return rows[0];
  }

  // Permissions
  async userCanView(userId: string, teamId: string): Promise<boolean> {
    const row = await getDatabase().query.teams.findFirst({
      where: and(eq(teams.id, teamId), eq(teams.userId, userId)),
    });

    return row !== null;
  }

  async userCanUpdate(userId: string, teamId: string): Promise<boolean> {
    return this.userCanView(userId, teamId);
  }

  async userCanDelete(userId: string, teamId: string): Promise<boolean> {
    return this.userCanUpdate(userId, teamId);
  }

  async userCanInvite(userId: string, teamId: string): Promise<boolean> {
    return this.userCanUpdate(userId, teamId);
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(teams.id).mapWith(Number),
      })
      .from(teams)
      .where(and(eq(teams.userId, userId), isNull(teams.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async getInvitationById(teamUserInvitationId: string): Promise<TeamUserInvitation | null> {
    const row = await getDatabase().query.teamUserInvitations.findFirst({
      where: eq(teamUserInvitations.id, teamUserInvitationId),
    });

    return row ?? null;
  }

  async getJoinedTeamByUserId(userId: string): Promise<{ team: Team; teamUser: TeamUser } | null> {
    const rows = await getDatabase()
      .select()
      .from(teamUsers)
      .leftJoin(teams, eq(teamUsers.teamId, teams.id))
      .where(and(eq(teamUsers.userId, userId), isNull(teams.deletedAt)))
      .orderBy(desc(teamUsers.updatedAt))
      .limit(1)
      .execute();
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    if (!row.teams || !row.team_users) {
      return null;
    }

    return {
      team: row.teams,
      teamUser: row.team_users,
    };
  }

  async getMembersByTeamId(teamId: string): Promise<TeamUser[]> {
    const where = and(eq(teamUsers.teamId, teamId), isNull(teams.deletedAt));

    const rows = await getDatabase()
      .select()
      .from(teamUsers)
      .leftJoin(teams, eq(teams.id, teamUsers.teamId))
      .leftJoin(users, eq(users.id, teamUsers.userId))
      .where(where)
      .execute();

    return rows.map((row) => {
      // Really be mindful that we only want to expose the minimum required fields here!
      const user = row.users
        ? {
            id: row.users.id,
            displayName: row.users.displayName,
            birthDate: row.users.birthDate,
            email: row.users.email,
            createdAt: row.users.createdAt,
          }
        : undefined;

      return {
        ...row.team_users,
        user,
      };
    });
  }

  async getInvitationsByTeamId(teamId: string): Promise<TeamUserInvitation[]> {
    const where = and(
      eq(teamUserInvitations.teamId, teamId),
      isNull(teamUserInvitations.acceptedAt),
      isNull(teamUserInvitations.rejectedAt),
      isNull(teams.deletedAt)
    );

    const rows = await getDatabase()
      .select()
      .from(teamUserInvitations)
      .leftJoin(teams, eq(teams.id, teamUserInvitations.teamId))
      .where(where)
      .execute();

    return rows.map((row) => {
      return row.team_user_invitations;
    });
  }

  async getInvitationsByUser(userId: string, userEmail?: string): Promise<TeamUserInvitation[]> {
    const now = new Date();
    const where = and(
      userEmail
        ? or(eq(teamUserInvitations.userId, userId), eq(teamUserInvitations.email, userEmail))
        : eq(teamUserInvitations.userId, userId),
      isNull(teamUserInvitations.acceptedAt),
      isNull(teamUserInvitations.rejectedAt),
      gt(teamUserInvitations.expiresAt, now),
      isNull(teams.deletedAt)
    );

    const rows = await getDatabase()
      .select()
      .from(teamUserInvitations)
      .leftJoin(teams, eq(teams.id, teamUserInvitations.teamId))
      .leftJoin(users, eq(users.id, teamUserInvitations.invitedByUserId))
      .where(where)
      .execute();

    return rows.map((row) => {
      // Again, really be mindful that we only want to expose the minimum required fields here!
      const user = row.users
        ? {
            id: row.users.id,
            displayName: row.users.displayName,
            birthDate: row.users.birthDate,
            email: row.users.email,
            createdAt: row.users.createdAt,
          }
        : undefined;

      return {
        ...row.team_user_invitations,
        team: row.teams,
        invitedByUser: user,
      };
    });
  }

  async acceptInvitationByIdAndUserId(
    teamUserInvitationId: string,
    userId: string
  ): Promise<TeamUserInvitation | null> {
    const now = new Date();
    const where = and(
      eq(teamUserInvitations.id, teamUserInvitationId),
      eq(teamUserInvitations.userId, userId),
      isNull(teamUserInvitations.acceptedAt),
      isNull(teamUserInvitations.rejectedAt),
      gt(teamUserInvitations.expiresAt, now)
    );

    const rows = await getDatabase()
      .update(teamUserInvitations)
      .set({ acceptedAt: now })
      .where(where)
      .returning();

    const row = rows[0] ?? null;

    if (row) {
      await getDatabase().insert(teamUsers).values({
        teamId: row.teamId,
        userId,
        roles: row.roles,
      });
    }

    return row;
  }

  async rejectInvitationByIdAndUserId(
    teamUserInvitationId: string,
    userId: string
  ): Promise<TeamUserInvitation | null> {
    const now = new Date();
    const where = and(
      eq(teamUserInvitations.id, teamUserInvitationId),
      eq(teamUserInvitations.userId, userId),
      isNull(teamUserInvitations.acceptedAt),
      isNull(teamUserInvitations.rejectedAt),
      gt(teamUserInvitations.expiresAt, now)
    );

    const rows = await getDatabase()
      .update(teamUserInvitations)
      .set({ rejectedAt: now })
      .where(where)
      .returning();

    return rows[0] ?? null;
  }

  async deleteInvitationByIdAndUserId(
    teamUserInvitationId: string,
    userId: string
  ): Promise<TeamUserInvitation | null> {
    const teamUserInvitation = await this.getInvitationById(teamUserInvitationId);
    if (!teamUserInvitation) {
      return null;
    }

    if (teamUserInvitation.userId !== userId && teamUserInvitation.invitedByUserId !== userId) {
      throw new Error('You cannot delete this invitation');
    }

    const rows = await getDatabase()
      .delete(teamUserInvitations)
      .where(eq(teamUserInvitations.id, teamUserInvitation.id))
      .returning();

    return rows[0] ?? null;
  }

  async sendInvitation(
    teamId: string,
    invitedByUserId: string,
    email: string
  ): Promise<TeamUserInvitation> {
    const userCanInvite = await this.userCanInvite(invitedByUserId, teamId);
    if (!userCanInvite) {
      throw new Error('You cannot send invites for this team');
    }

    const existingUser = await getDatabase().query.users.findFirst({
      where: eq(users.email, email),
    });
    const userId = existingUser?.id ?? null;

    const existingInvitation = await getDatabase().query.teamUserInvitations.findFirst({
      where: and(
        eq(teamUserInvitations.teamId, teamId),
        userId ? eq(teamUserInvitations.userId, userId) : eq(teamUserInvitations.email, email),
        isNull(teamUserInvitations.acceptedAt),
        isNull(teamUserInvitations.rejectedAt)
      ),
    });
    if (existingInvitation) {
      throw new Error('User is already invited');
    }

    if (userId) {
      const existingTeamMember = await getDatabase().query.teamUsers.findFirst({
        where: and(eq(teamUsers.teamId, teamId), eq(teamUsers.userId, userId)),
      });
      if (existingTeamMember) {
        throw new Error('User is already a member');
      }
    }

    const invitedByUser = await getDatabase().query.users.findFirst({
      where: eq(users.id, invitedByUserId),
    });

    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const expiresAt = addDays(new Date(), 7);

    const teamUserInvitationRows = await getDatabase()
      .insert(teamUserInvitations)
      .values({
        roles: [TeamUserRoleEnum.MEMBER],
        email,
        expiresAt,
        teamId,
        userId,
        invitedByUserId,
      })
      .returning();

    const teamUserInvitation = teamUserInvitationRows[0];

    await mailer.sendAuthTeamInviteMemberEmail({
      userEmail: email,
      teamName: team.name,
      invitedByUserDisplayName: invitedByUser?.displayName ?? 'Unknown',
      registerUrl: `${WEB_URL}/register?teamUserInvitationId=${teamUserInvitation.id}`,
    });

    return teamUserInvitation;
  }

  async createAndJoin(
    userId: string,
    teamName: string
  ): Promise<{ team: Team; teamUser: TeamUser }> {
    const team = await this.insertOne({
      name: teamName,
      userId,
    });

    const teamUserRows = await getDatabase()
      .insert(teamUsers)
      .values({
        teamId: team.id,
        userId,
        roles: [TeamUserRoleEnum.ADMIN],
      })
      .returning();

    return {
      team,
      teamUser: teamUserRows[0],
    };
  }

  async leaveTeam(userId: string, teamId: string) {
    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const rows = await getDatabase()
      .delete(teamUsers)
      .where(and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)))
      .returning();

    return rows[0] ?? null;
  }
}

export const teamsManager = new TeamsManager();
