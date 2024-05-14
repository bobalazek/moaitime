import { and, count, eq, isNull } from 'drizzle-orm';

import { calendars, getDatabase, lists, Team, teamUsers } from '@moaitime/database-core';
import { TeamLimits, TeamUsage } from '@moaitime/shared-common';

export class TeamUsageManager {
  // Helpers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTeamLimits(team: Team): Promise<TeamLimits> {
    // TODO: once we have plans, we need to adjust the limits depending on that

    return {
      tasksMaxPerListCount: 100,
      listsMaxPerTeamCount: 25,
      usersMaxPerTeamCount: 10,
      calendarsMaxPerTeamCount: 20,
      calendarsMaxEventsPerCalendarCount: 10000,
    };
  }

  async getTeamLimit(team: Team, key: keyof TeamLimits): Promise<number> {
    const limits = await this.getTeamLimits(team);

    return limits[key];
  }

  async getTeamUsage(team: Team): Promise<TeamUsage> {
    // TODO: cache!
    // TODO: same as for UserUsageManager - once DI is sorted, use the manager services here

    const database = getDatabase();

    const listsCount = await database
      .select({ count: count() })
      .from(lists)
      .where(and(eq(lists.teamId, team.id), isNull(lists.deletedAt)))
      .execute();
    const usersCount = await database
      .select({
        count: count(teamUsers.id).mapWith(Number),
      })
      .from(teamUsers)
      .where(eq(teamUsers.teamId, team.id))
      .execute();
    const calendarsCount = await database
      .select({ count: count() })
      .from(calendars)
      .where(and(eq(calendars.teamId, team.id), isNull(calendars.deletedAt)))
      .execute();

    return {
      listsCount: listsCount[0].count ?? 0,
      usersCount: usersCount[0].count ?? 0,
      calendarsCount: calendarsCount[0].count ?? 0,
    };
  }
}

export const teamUsageManager = new TeamUsageManager();
