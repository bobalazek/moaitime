import { eq } from 'drizzle-orm';

import { calendars, getDatabase, NewEvent } from '@moaitime/database-core';

import { publicCalendarEvents } from './events/PublicCalendarEvents';

export const getEventSeeds = async (): Promise<NewEvent[]> => {
  const events: NewEvent[] = [];
  const rawEvents = publicCalendarEvents;

  for (const single of rawEvents) {
    const calendar = await getDatabase().query.calendars.findFirst({
      where: eq(calendars.name, single.calendarName),
    });
    if (!calendar) {
      throw new Error(`Calendar "${single.calendarName}" not found!`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { calendarName, date, ...event } = single;

    const dateObject = new Date(`${date}T00:00:00.000`);
    if (!dateObject || isNaN(dateObject.getTime())) {
      throw new Error(`Invalid date "${date}"!`);
    }

    events.push({
      calendarId: calendar.id,
      isAllDay: true,
      startsAt: dateObject,
      endsAt: dateObject,
      timezone: calendar.timezone,
      ...event,
    });
  }

  return events;
};
