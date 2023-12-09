import { eq } from 'drizzle-orm';

import { getDatabase, NewCalendar, users } from '@myzenbuddy/database-core';

import { getUserFixtures } from './Users';

export const getCalendarFixtures = async (): Promise<NewCalendar[]> => {
  const caledars: NewCalendar[] = [];

  const userSeeds = await getUserFixtures();
  for (const single of userSeeds) {
    const user = await getDatabase().query.users.findFirst({
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
