import { eq } from 'drizzle-orm';

import { databaseClient, NewCalendar, users } from '@myzenbuddy/database-core';

import { getUserSeeds } from './Users';

export const getCalendarSeeds = async (): Promise<NewCalendar[]> => {
  const caledars: NewCalendar[] = [];

  const userSeeds = await getUserSeeds();
  for (const single of userSeeds) {
    const user = await databaseClient.query.users.findFirst({
      where: eq(users.email, single.email),
    });
    if (!user) {
      throw new Error(`User "${single.email}" not found!`);
    }

    caledars.push({
      name: `${user.displayName}'s Calendar`,
      timezone: 'Europe/Ljubljana',
      userId: user.id,
    });
  }

  return caledars;
};
