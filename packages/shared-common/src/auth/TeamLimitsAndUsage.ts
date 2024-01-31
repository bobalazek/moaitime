export type TeamLimits = {
  tasksMaxPerListCount: number;
  listsMaxPerTeamCount: number;
  calendarsMaxPerTeamCount: number;
  calendarsMaxEventsPerCalendarCount: number;
};

export type TeamUsage = {
  listsCount: number;
  calendarsCount: number;
};
