import {
  calendars,
  events,
  getDatabaseMigrationClient,
  lists,
  users,
} from '@myzenbuddy/database-core';
import { logger } from '@myzenbuddy/shared-logging';

import { getCalendarFixtures } from './data/Calendars';
import { getEventFixtures } from './data/Events';
import { getListFixtures } from './data/Lists';
import { getUserFixtures } from './data/Users';

export const insertDatabaseFixtureData = async () => {
  try {
    logger.info('Inserting database fixture data ...');

    logger.debug('Inserting user fixtures ...');
    const userFixtures = await getUserFixtures();
    await getDatabaseMigrationClient().insert(users).values(userFixtures).execute();

    logger.debug('Inserting calendar fixtures ...');
    const calendarFixtures = await getCalendarFixtures();
    await getDatabaseMigrationClient().insert(calendars).values(calendarFixtures).execute();

    logger.debug('Inserting event fixtures ...');
    const eventFixtures = await getEventFixtures();
    await getDatabaseMigrationClient().insert(events).values(eventFixtures).execute();

    logger.debug('Inserting list fixtures ...');
    const listFixtures = await getListFixtures();
    await getDatabaseMigrationClient().insert(lists).values(listFixtures).execute();

    logger.info('Database fixture data inserted successfully');
  } catch (error) {
    logger.error(error, 'Database fixture data insertion failed');

    throw error;
  }
};
