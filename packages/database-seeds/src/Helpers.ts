import {
  backgrounds,
  calendars,
  databaseClient,
  greetings,
  quotes,
  users,
} from '@myzenbuddy/database-core';

import { getBackgroundsSeeds } from './data/Backgrounds';
import { getCalendarSeeds } from './data/Calendars';
import { getGreetingsSeeds } from './data/Greetings';
import { getQuotesSeeds } from './data/Quotes';
import { getUserSeeds } from './data/Users';

export const insertDatabaseSeedData = async () => {
  const userSeeds = await getUserSeeds();
  await databaseClient.insert(users).values(userSeeds).execute();

  const calendarSeeds = await getCalendarSeeds();
  await databaseClient.insert(calendars).values(calendarSeeds).execute();

  const backgroundSeeds = await getBackgroundsSeeds();
  await databaseClient.insert(backgrounds).values(backgroundSeeds).execute();

  const greetingSeeds = await getGreetingsSeeds();
  await databaseClient.insert(greetings).values(greetingSeeds).execute();

  const quoteSeeds = await getQuotesSeeds();
  await databaseClient.insert(quotes).values(quoteSeeds).execute();
};
