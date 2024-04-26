import { User } from '@moaitime/database-core';
import { StatisticsGeneralBasicData } from '@moaitime/shared-common';

import { userUsageManager } from '../auth/UserUsageManager';

export class StatisticsManager {
  // Helpers
  async getGeneral(user: User): Promise<StatisticsGeneralBasicData> {
    const userUsage = await userUsageManager.getUserUsage(user);

    return {
      listsCountTotal: userUsage.listsCount,
      tasksCountTotal: userUsage.tasksCount,
      tagsCountTotal: userUsage.tagsCount,
      notesCountTotal: userUsage.notesCount,
      calendarsCountTotal: userUsage.calendarsCount,
      eventsCountTotal: userUsage.eventsCount,
      habitsCountTotal: userUsage.habitsCount,
      moodEntriesCountTotal: userUsage.moodEntriesCount,
      focusSessionsCountTotal: userUsage.focusSessionsCount,
    };
  }
}

export const statisticsManager = new StatisticsManager();
