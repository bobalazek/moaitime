import { eq } from 'drizzle-orm';

import { getDatabase, NewCalendar, users } from '@moaitime/database-core';
import { MAIN_COLORS } from '@moaitime/shared-common';

import { publicCalendars } from './calendars/PublicCalendars';
import { getUserSeeds } from './Users';

export const getCalendarSeeds = async (): Promise<NewCalendar[]> => {
  const calendars = [...publicCalendars];

  const userSeeds = await getUserSeeds();
  for (const single of userSeeds) {
    const user = await getDatabase().query.users.findFirst({
      where: eq(users.email, single.email),
    });
    if (!user) {
      throw new Error(`User "${single.email}" not found!`);
    }

    calendars.push({
      name: `📅 ${user.displayName}'s Calendar`,
      timezone: user.settings?.generalTimezone ?? 'UTC',
      userId: user.id,
      color: MAIN_COLORS[0].value,
    });
  }

  return calendars;
};
