import { eq } from 'drizzle-orm';

import {
  backgrounds,
  calendars,
  events,
  getMigrationDatabase,
  greetings,
  interests,
  lists,
  posts,
  quotes,
  tasks,
  users,
} from '@moaitime/database-core';
import { logger } from '@moaitime/logging';

import { getBackgroundsSeeds } from './data/Backgrounds';
import { getCalendarSeeds } from './data/Calendars';
import { getEventSeeds } from './data/Events';
import { getGreetingSeeds } from './data/Greetings';
import { getInterestsSeeds } from './data/Interests';
import { getListSeeds } from './data/Lists';
import { getPostSeeds } from './data/Posts';
import { getQuoteSeeds } from './data/Quotes';
import { getTaskSeeds } from './data/Tasks';
import { getUserSeeds } from './data/Users';

export const insertDatabaseSeedData = async () => {
  try {
    logger.info('Inserting database seed data ...');

    const database = getMigrationDatabase();

    logger.debug('Inserting user seeds ...');
    const userSeeds = await getUserSeeds();
    await database.insert(users).values(userSeeds).execute();

    logger.debug('Inserting post seeds ...');
    const postSeeds = await getPostSeeds();
    await database.insert(posts).values(postSeeds).execute();

    logger.debug('Inserting calendar seeds ...');
    const calendarSeeds = await getCalendarSeeds();
    await database.insert(calendars).values(calendarSeeds).execute();

    logger.debug('Inserting event seeds ...');
    const eventSeeds = await getEventSeeds();
    await database.insert(events).values(eventSeeds).execute();

    logger.debug('Inserting background seeds ...');
    const backgroundSeeds = await getBackgroundsSeeds();
    await database.insert(backgrounds).values(backgroundSeeds).execute();

    logger.debug('Inserting greeting seeds ...');
    const greetingSeeds = await getGreetingSeeds();
    await database.insert(greetings).values(greetingSeeds).execute();

    logger.debug('Inserting quote seeds ...');
    const quoteSeeds = await getQuoteSeeds();
    await database.insert(quotes).values(quoteSeeds).execute();

    logger.debug('Inserting list seeds ...');
    const listSeeds = await getListSeeds();
    await database.insert(lists).values(listSeeds).execute();

    logger.debug('Inserting task seeds ...');
    const taskSeeds = await getTaskSeeds();
    await database.insert(tasks).values(taskSeeds).execute();

    logger.debug('Inserting interest seeds ...');
    const interestSeeds = await getInterestsSeeds();
    for (const interest of interestSeeds) {
      const { parentSlug, ...rest } = interest;

      let parentId: string | undefined;
      if (parentSlug) {
        const rows = await database
          .select()
          .from(interests)
          .where(eq(interests.slug, parentSlug))
          .execute();
        if (rows.length === 0) {
          throw new Error(`Parent interest with slug "${parentSlug}" not found`);
        }

        parentId = rows[0].id;
      }

      await database
        .insert(interests)
        .values({ ...rest, parentId })
        .execute();
    }

    logger.info('Successfully inserted database seed data');
  } catch (error) {
    logger.error(error, 'Failed to insert database seed data');

    throw error;
  }
};
