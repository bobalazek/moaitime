import { and, count, DBQueryConfig, desc, eq, isNotNull, isNull, lt } from 'drizzle-orm';

import {
  getDatabase,
  NewTeam,
  Team,
  teams,
  TeamUser,
  teamUsers,
  users,
} from '@moaitime/database-core';
import { TeamUserRoleEnum } from '@moaitime/shared-common';

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

  async getJoinedTeamByUserId(userId: string): Promise<{ team: Team; teamUser: TeamUser } | null> {
    const rows = await getDatabase()
      .select()
      .from(teamUsers)
      .leftJoin(teams, eq(teamUsers.teamId, teams.id))
      .where(
        and(
          eq(teamUsers.userId, userId),
          isNotNull(teamUsers.inviteAcceptedAt),
          isNull(teams.deletedAt)
        )
      )
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

  async getPendingInvitationsByUserId(userId: string): Promise<TeamUser[]> {
    const now = new Date();
    const where = and(
      eq(teamUsers.userId, userId),
      isNull(teamUsers.inviteAcceptedAt),
      isNull(teamUsers.inviteRejectedAt),
      lt(teamUsers.inviteExpiresAt, now),
      isNull(teams.deletedAt)
    );

    return getDatabase().query.teamUsers.findMany({
      where,
      with: {
        team: true,
      },
    });
  }

  async acceptInvitationByUserId(userId: string, teamUserId: string): Promise<TeamUser | null> {
    const now = new Date();
    const where = and(
      eq(teamUsers.id, teamUserId),
      eq(teamUsers.userId, userId),
      isNull(teamUsers.inviteAcceptedAt),
      isNull(teamUsers.inviteRejectedAt),
      lt(teamUsers.inviteExpiresAt, now)
    );

    const rows = await getDatabase()
      .update(teamUsers)
      .set({ inviteAcceptedAt: now })
      .where(where)
      .returning();

    return rows[0] ?? null;
  }

  async rejectInvitationByUserId(userId: string, teamUserId: string): Promise<TeamUser | null> {
    const now = new Date();
    const where = and(
      eq(teamUsers.id, teamUserId),
      eq(teamUsers.userId, userId),
      isNull(teamUsers.inviteAcceptedAt),
      isNull(teamUsers.inviteRejectedAt),
      lt(teamUsers.inviteExpiresAt, now)
    );

    const rows = await getDatabase()
      .update(teamUsers)
      .set({ inviteRejectedAt: now })
      .where(where)
      .returning();

    return rows[0] ?? null;
  }

  async sendInvitation(
    invitedByUserId: string,
    teamId: string,
    inviteEmail: string
  ): Promise<TeamUser> {
    const existingUser = await getDatabase().query.users.findFirst({
      where: eq(users.email, inviteEmail),
    });
    const userId = existingUser?.id ?? null;

    const teamUserRows = await getDatabase()
      .insert(teamUsers)
      .values({
        roles: [TeamUserRoleEnum.MEMBER],
        inviteEmail,
        teamId,
        userId,
        invitedByUserId,
      })
      .returning();

    const teamUser = teamUserRows[0];

    // TODO: send invite email

    return teamUser;
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
        inviteAcceptedAt: new Date(),
      })
      .returning();

    return {
      team,
      teamUser: teamUserRows[0],
    };
  }

  async leave(userId: string, teamId: string) {
    const rows = await getDatabase()
      .delete(teamUsers)
      .where(and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)))
      .returning();

    return rows[0];
  }
}

export const teamsManager = new TeamsManager();
