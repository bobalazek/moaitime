export type UserLimits = {
  tasksMaxPerListCount: number;
  listsMaxPerUserCount: number;
  tagsMaxPerUserCount: number;
  calendarsMaxPerUserCount: number;
  calendarsMaxEventsPerCalendarCount: number;
  calendarsMaxUserCalendarsPerUserCount: number;
  notesMaxPerUserCount: number;
};

export type UserUsage = {
  listsCount: number;
  tasksCount: number;
  notesCount: number;
  moodEntriesCount: number;
  calendarsCount: number;
  eventsCount: number;
  tagsCount: number;
  focusSessionsCount: number;
};
