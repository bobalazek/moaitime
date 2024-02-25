export type UserLimits = {
  teamsMaxPerUserCount: number;
  tasksMaxPerListCount: number;
  listsMaxPerUserCount: number;
  tagsMaxPerUserCount: number;
  calendarsMaxPerUserCount: number;
  calendarsMaxEventsPerCalendarCount: number;
  calendarsMaxUserCalendarsPerUserCount: number;
  notesMaxPerUserCount: number;
  userInvitationsMaxPerUserCount: number;
};

export type UserUsage = {
  listsCount: number;
  tasksCount: number;
  notesCount: number;
  moodEntriesCount: number;
  calendarsCount: number;
  userCalendarsCount: number; // those are the user_calendars, or rather "shared calendars" as we call them on the frontend
  eventsCount: number;
  tagsCount: number;
  focusSessionsCount: number;
  userInvitationsCount: number;
};
