import { and, count, eq, isNull } from 'drizzle-orm';

import {
  calendars,
  events,
  focusSessions,
  getDatabase,
  habits,
  invitations,
  lists,
  moodEntries,
  notes,
  tags,
  tasks,
  User,
  userCalendars,
} from '@moaitime/database-core';
import { UserLimits, UserUsage } from '@moaitime/shared-common';

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
    // TODO: use the managers once we have the DI sorted out

    const database = getDatabase();

    const listsCount = await database
      .select({ count: count() })
      .from(lists)
      .where(and(eq(lists.userId, user.id), isNull(lists.deletedAt)))
      .execute();
    const tasksCount = await database
      .select({ count: count() })
      .from(tasks)
      .where(and(eq(tasks.userId, user.id), isNull(tasks.deletedAt)))
      .execute();
    const tagsCount = await database
      .select({ count: count() })
      .from(tags)
      .where(and(eq(tags.userId, user.id), isNull(tags.teamId), isNull(tags.deletedAt)))
      .execute();
    const habitsCount = await database
      .select({ count: count() })
      .from(habits)
      .where(and(eq(habits.userId, user.id), isNull(habits.deletedAt)))
      .execute();
    const notesCount = await database
      .select({ count: count() })
      .from(notes)
      .where(and(eq(notes.userId, user.id), isNull(notes.deletedAt)))
      .execute();
    const moodEntriesCount = await database
      .select({ count: count() })
      .from(moodEntries)
      .where(and(eq(moodEntries.userId, user.id), isNull(moodEntries.deletedAt)));
    const calendarsCount = await database
      .select({ count: count() })
      .from(calendars)
      .where(
        and(eq(calendars.userId, user.id), isNull(calendars.teamId), isNull(calendars.deletedAt))
      )
      .execute();
    const userCalendarsCount = await database
      .select({ count: count() })
      .from(userCalendars)
      .where(and(eq(userCalendars.userId, user.id)))
      .execute();
    const eventsCount = await database
      .select({ count: count() })
      .from(events)
      .where(and(eq(events.userId, user.id), isNull(events.deletedAt)))
      .execute();
    const focusSessionsCount = await database
      .select({ count: count() })
      .from(focusSessions)
      .where(and(eq(focusSessions.userId, user.id), isNull(focusSessions.deletedAt)))
      .execute();
    const userInvitationsCount = await database
      .select({ count: count() })
      .from(invitations)
      .where(and(eq(invitations.userId, user.id)))
      .execute();

    return {
      listsCount: listsCount[0].count ?? 0,
      tasksCount: tasksCount[0].count ?? 0,
      tagsCount: tagsCount[0].count ?? 0,
      habitsCount: habitsCount[0].count ?? 0,
      notesCount: notesCount[0].count ?? 0,
      moodEntriesCount: moodEntriesCount[0].count ?? 0,
      calendarsCount: calendarsCount[0].count ?? 0,
      userCalendarsCount: userCalendarsCount[0].count ?? 0,
      eventsCount: eventsCount[0].count ?? 0,
      focusSessionsCount: focusSessionsCount[0].count ?? 0,
      userInvitationsCount: userInvitationsCount[0].count ?? 0,
    };
  }
}

export const userUsageManager = new UserUsageManager();
