import { and, count, DBQueryConfig, desc, eq, isNull } from 'drizzle-orm';

import { getDatabase, NewTeam, Team, teams, TeamUser } from '@moaitime/database-core';

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

  async getTeamByUserId(userId: string): Promise<{ team: Team; teamUser: TeamUser } | null> {
    const row = await getDatabase().query.teamUsers.findFirst({
      where: eq(teams.userId, userId),
      with: {
        team: true,
      },
    });
    if (!row) {
      return null;
    }

    const { team, ...teamUser } = row;

    return {
      team,
      teamUser,
    };
  }
}

export const teamsManager = new TeamsManager();
