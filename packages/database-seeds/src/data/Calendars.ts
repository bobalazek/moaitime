import { eq } from 'drizzle-orm';

import { getDatabase, NewCalendar, users } from '@moaitime/database-core';

import { publicCalendars } from './calendars/PublicCalendars';
import { getUserSeeds } from './Users';

export const getCalendarSeeds = async (): Promise<NewCalendar[]> => {
  const caledars = [...publicCalendars];

  const userSeeds = await getUserSeeds();
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
