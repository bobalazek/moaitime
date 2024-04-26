import { User } from '@moaitime/database-core';
import { UserLimits, UserUsage } from '@moaitime/shared-common';

import { calendarsManager } from '../calendars/CalendarsManager';
import { eventsManager } from '../calendars/EventsManager';
import { focusSessionsManager } from '../focus/FocusSessionsManager';
import { habitsManager } from '../habits/HabitsManager';
import { moodEntriesManager } from '../mood/MoodEntriesManager';
import { notesManager } from '../notes/NotesManager';
import { invitationsManager } from '../social/InvitationsManager';
import { listsManager } from '../tasks/ListsManager';
import { tagsManager } from '../tasks/TagsManager';
import { tasksManager } from '../tasks/TasksManager';

export class UserUsageManager {
  // Helpers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserLimits(user: User): Promise<UserLimits> {
    // TODO: once we have plans, we need to adjust the limits depending on that

    return {
      teamsMaxPerUserCount: 1,
      tasksMaxPerListCount: 100,
      listsMaxPerUserCount: 25,
      tagsMaxPerUserCount: 50,
      habitsMaxPerUserCount: 100,
      calendarsMaxPerUserCount: 20,
      calendarsMaxEventsPerCalendarCount: 10000,
      calendarsMaxUserCalendarsPerUserCount: 100,
      notesMaxPerUserCount: 1000,
      userInvitationsMaxPerUserCount: 10,
    };
  }

  async getUserLimit(user: User, key: keyof UserLimits): Promise<number> {
    const limits = await this.getUserLimits(user);

    return limits[key];
  }

  async getUserUsage(user: User): Promise<UserUsage> {
    // TODO: cache!

    const listsCount = await listsManager.countByUserId(user.id);
    const tasksCount = await tasksManager.countByUserId(user.id);
    const tagsCount = await tagsManager.countByUserId(user.id);
    const habitsCount = await habitsManager.countByUserId(user.id);
    const notesCount = await notesManager.countByUserId(user.id);
    const moodEntriesCount = await moodEntriesManager.countByUserId(user.id);
    const calendarsCount = await calendarsManager.countByUserId(user.id);
    const userCalendarsCount = await calendarsManager.countUserCalendarsByUserId(user.id);
    const eventsCount = await eventsManager.countByUserId(user.id);
    const focusSessionsCount = await focusSessionsManager.countByUserId(user.id);
    const userInvitationsCount = await invitationsManager.countByUserId(user.id);

    return {
      listsCount,
      tasksCount,
      tagsCount,
      habitsCount,
      notesCount,
      moodEntriesCount,
      calendarsCount,
      userCalendarsCount,
      eventsCount,
      focusSessionsCount,
      userInvitationsCount,
    };
  }
}

export const userUsageManager = new UserUsageManager();
