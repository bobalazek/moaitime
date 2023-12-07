import {
  backgrounds,
  calendars,
  databaseClient,
  greetings,
  lists,
  quotes,
  users,
} from '@myzenbuddy/database-core';

import { getListSeeds } from '.';
import { getBackgroundsSeeds } from './data/Backgrounds';
import { getCalendarSeeds } from './data/Calendars';
import { getGreetingsSeeds as getGreetingSeeds } from './data/Greetings';
import { getQuotesSeeds as getQuoteSeeds } from './data/Quotes';
import { getUserSeeds } from './data/Users';

export const insertDatabaseSeedData = async () => {
  const userSeeds = await getUserSeeds();
  await databaseClient.insert(users).values(userSeeds).execute();

  const calendarSeeds = await getCalendarSeeds();
  await databaseClient.insert(calendars).values(calendarSeeds).execute();

  const backgroundSeeds = await getBackgroundsSeeds();
  await databaseClient.insert(backgrounds).values(backgroundSeeds).execute();

  const greetingSeeds = await getGreetingSeeds();
  await databaseClient.insert(greetings).values(greetingSeeds).execute();

  const quoteSeeds = await getQuoteSeeds();
  await databaseClient.insert(quotes).values(quoteSeeds).execute();

  const listSeeds = await getListSeeds();
  await databaseClient.insert(lists).values(listSeeds).execute();
};
