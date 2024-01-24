import { User } from '@moaitime/database-core';
import { StatisticsGeneral } from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';

export class StatisticsManager {
  async getGeneral(user: User): Promise<StatisticsGeneral> {
    const userUsage = await usersManager.getUserUsage(user);

    return {
      listsCountTotal: userUsage.listsCount,
      tasksCountTotal: userUsage.tasksCount,
      tagsCountTotal: userUsage.tagsCount,
      notesCountTotal: userUsage.notesCount,
      calendarsCountTotal: userUsage.calendarsCount,
      eventsCountTotal: userUsage.eventsCount,
      moodEntriesCountTotal: userUsage.moodEntriesCount,
      focusSessionsCountTotal: userUsage.focusSessionsCount,
    };
  }
}

export const statisticsManager = new StatisticsManager();
