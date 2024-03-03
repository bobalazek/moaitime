import {
  calendars,
  events,
  getMigrationDatabase,
  lists,
  posts,
  users,
} from '@moaitime/database-core';
import { logger } from '@moaitime/logging';

import { getCalendarFixtures } from './data/Calendars';
import { getEventFixtures } from './data/Events';
import { getListFixtures } from './data/Lists';
import { getPostFixtures } from './data/Posts';
import { getUserFixtures } from './data/Users';

export const insertDatabaseFixtureData = async () => {
  try {
    logger.info('Inserting database fixture data ...');

    const database = getMigrationDatabase();

    logger.debug('Inserting user fixtures ...');
    const userFixtures = await getUserFixtures();
    await database.insert(users).values(userFixtures).execute();

    logger.debug('Inserting post fixtures ...');
    const postFixtures = await getPostFixtures();
    await database.insert(posts).values(postFixtures).execute();

    logger.debug('Inserting calendar fixtures ...');
    const calendarFixtures = await getCalendarFixtures();
    await database.insert(calendars).values(calendarFixtures).execute();

    logger.debug('Inserting event fixtures ...');
    const eventFixtures = await getEventFixtures();
    await database.insert(events).values(eventFixtures).execute();

    logger.debug('Inserting list fixtures ...');
    const listFixtures = await getListFixtures();
    await database.insert(lists).values(listFixtures).execute();

    logger.info('Database fixture data inserted successfully');
  } catch (error) {
    logger.error(error, 'Database fixture data insertion failed');

    throw error;
  }
};
