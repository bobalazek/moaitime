export type TeamLimits = {
  tasksMaxPerListCount: number;
  listsMaxPerTeamCount: number;
  usersMaxPerTeamCount: number;
  calendarsMaxPerTeamCount: number;
  calendarsMaxEventsPerCalendarCount: number;
};

export type TeamUsage = {
  listsCount: number;
  usersCount: number;
  calendarsCount: number;
};
