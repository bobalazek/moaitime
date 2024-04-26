import { Team } from '@moaitime/database-core';
import { TeamLimits, TeamUsage } from '@moaitime/shared-common';

import { calendarsManager } from '../calendars/CalendarsManager';
import { listsManager } from '../tasks/ListsManager';
import { usersManager } from './UsersManager';

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

    const listsCount = await listsManager.countByTeamId(team.id);
    const usersCount = await usersManager.countByTeamId(team.id);
    const calendarsCount = await calendarsManager.countByTeamId(team.id);

    return {
      listsCount,
      usersCount,
      calendarsCount,
    };
  }
}

export const teamUsageManager = new TeamUsageManager();
