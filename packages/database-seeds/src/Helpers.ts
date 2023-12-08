import { eq } from 'drizzle-orm';

import {
  backgrounds,
  calendars,
  databaseClient,
  greetings,
  interests,
  lists,
  quotes,
  users,
} from '@myzenbuddy/database-core';
import { logger } from '@myzenbuddy/shared-logging';

import { getBackgroundsSeeds } from './data/Backgrounds';
import { getCalendarSeeds } from './data/Calendars';
import { getGreetingsSeeds as getGreetingSeeds } from './data/Greetings';
import { getInterestsSeeds } from './data/Interests';
import { getListSeeds } from './data/Lists';
import { getQuotesSeeds as getQuoteSeeds } from './data/Quotes';
import { getUserSeeds } from './data/Users';

export const insertDatabaseSeedData = async () => {
  logger.info('Inserting database seed data ...');

  logger.debug('Inserting user seeds ...');
  const userSeeds = await getUserSeeds();
  await databaseClient.insert(users).values(userSeeds).execute();

  logger.debug('Inserting calendar seeds ...');
  const calendarSeeds = await getCalendarSeeds();
  await databaseClient.insert(calendars).values(calendarSeeds).execute();

  logger.debug('Inserting background seeds ...');
  const backgroundSeeds = await getBackgroundsSeeds();
  await databaseClient.insert(backgrounds).values(backgroundSeeds).execute();

  logger.debug('Inserting greeting seeds ...');
  const greetingSeeds = await getGreetingSeeds();
  await databaseClient.insert(greetings).values(greetingSeeds).execute();

  logger.debug('Inserting quote seeds ...');
  const quoteSeeds = await getQuoteSeeds();
  await databaseClient.insert(quotes).values(quoteSeeds).execute();

  logger.debug('Inserting list seeds ...');
  const listSeeds = await getListSeeds();
  await databaseClient.insert(lists).values(listSeeds).execute();

  logger.debug('Inserting interest seeds ...');
  const interestSeeds = await getInterestsSeeds();
  for (const interest of interestSeeds) {
    const { parentSlug, ...rest } = interest;

    let parentId: string | undefined;
    if (parentSlug) {
      const rows = await databaseClient
        .select()
        .from(interests)
        .where(eq(interests.slug, parentSlug))
        .execute();
      if (rows.length === 0) {
        throw new Error(`Parent interest with slug "${parentSlug}" not found`);
      }

      parentId = rows[0].id;
    }

    await databaseClient
      .insert(interests)
      .values({ ...rest, parentId })
      .execute();
  }

  logger.info('Successfully inserted database seed data');
};
