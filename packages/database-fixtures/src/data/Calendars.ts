import { eq } from 'drizzle-orm';

import { getDatabase, NewCalendar, users } from '@moaitime/database-core';

import { getUserFixtures } from './Users';

export const getCalendarFixtures = async (): Promise<NewCalendar[]> => {
  const calendars: NewCalendar[] = [];

  const userFixtures = await getUserFixtures();
  for (const single of userFixtures) {
    const user = await getDatabase().query.users.findFirst({
      where: eq(users.email, single.email),
    });
    if (!user) {
      throw new Error(`User "${single.email}" not found!`);
    }

    calendars.push({
      name: `${user.displayName}'s Calendar`,
      timezone: user.settings?.generalTimezone ?? 'UTC',
      userId: user.id,
    });
  }

  return calendars;
};
