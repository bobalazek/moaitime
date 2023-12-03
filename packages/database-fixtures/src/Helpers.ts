import { calendars, databaseClient, events, users } from '@myzenbuddy/database-core';

import { getCalendarFixtures } from './data/Calendars';
import { getEventFixtures } from './data/Events';
import { getUserFixtures } from './data/Users';

export const insertDatabaseFixtureData = async () => {
  const userFixtures = await getUserFixtures();
  await databaseClient.insert(users).values(userFixtures).execute();

  const calendarFixtures = await getCalendarFixtures();
  await databaseClient.insert(calendars).values(calendarFixtures).execute();

  const eventFixtures = await getEventFixtures();
  await databaseClient.insert(events).values(eventFixtures).execute();
};
