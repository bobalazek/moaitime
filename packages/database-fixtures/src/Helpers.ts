import { calendars, databaseClient, events, lists, users } from '@myzenbuddy/database-core';
import { logger } from '@myzenbuddy/shared-logging';

import { getCalendarFixtures } from './data/Calendars';
import { getEventFixtures } from './data/Events';
import { getListFixtures } from './data/Lists';
import { getUserFixtures } from './data/Users';

export const insertDatabaseFixtureData = async () => {
  logger.info('Inserting database fixture data ...');

  logger.debug('Inserting user fixtures ...');
  const userFixtures = await getUserFixtures();
  await databaseClient.insert(users).values(userFixtures).execute();

  logger.debug('Inserting calendar fixtures ...');
  const calendarFixtures = await getCalendarFixtures();
  await databaseClient.insert(calendars).values(calendarFixtures).execute();

  logger.debug('Inserting event fixtures ...');
  const eventFixtures = await getEventFixtures();
  await databaseClient.insert(events).values(eventFixtures).execute();

  logger.debug('Inserting list fixtures ...');
  const listFixtures = await getListFixtures();
  await databaseClient.insert(lists).values(listFixtures).execute();

  logger.info('Database fixture data inserted successfully');
};
