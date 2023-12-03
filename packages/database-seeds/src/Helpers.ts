import { calendars, databaseClient, users } from '@myzenbuddy/database-core';

import { getCalendarSeeds } from './data/Calendars';
import { getUserSeeds } from './data/Users';

export const insertDatabaseSeedData = async () => {
  const userSeeds = await getUserSeeds();
  await databaseClient.insert(users).values(userSeeds).execute();

  const calendarSeeds = await getCalendarSeeds();
  await databaseClient.insert(calendars).values(calendarSeeds).execute();
};
