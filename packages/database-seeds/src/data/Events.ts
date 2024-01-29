import { eq, like } from 'drizzle-orm';

import { calendars, getDatabase, NewEvent } from '@moaitime/database-core';
import { CreateEventSchema, isValidDate } from '@moaitime/shared-common';

import { publicCalendarEvents } from './events/PublicCalendarEvents';

export const getEventSeeds = async (): Promise<NewEvent[]> => {
  const events: NewEvent[] = [];
  const rawEvents = publicCalendarEvents;

  for (const single of rawEvents) {
    let calendar = await getDatabase().query.calendars.findFirst({
      where: eq(calendars.name, single.calendarName),
    });
    if (!calendar) {
      calendar = await getDatabase().query.calendars.findFirst({
        where: like(calendars.name, `%${single.calendarName}%`),
      });

      if (!calendar) {
        throw new Error(`Calendar "${single.calendarName}" not found!`);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { calendarName, date, endDate, timezone, ...event } = single;

    const isAllDay = date.length === 10;

    const startDateString = isAllDay ? `${date}T00:00:00.000` : date;
    const endDateString = isAllDay || !endDate ? `${date}T00:00:00.000` : endDate;

    if (!isValidDate(startDateString)) {
      throw new Error(`Invalid start date "${startDateString}"!`);
    }

    if (!isValidDate(endDateString)) {
      throw new Error(`Invalid end date "${endDateString}"!`);
    }

    const eventData = CreateEventSchema.parse({
      calendarId: calendar.id,
      isAllDay,
      startsAt: startDateString,
      endsAt: endDateString,
      timezone: timezone ?? calendar.timezone,
      ...event,
    });

    events.push({
      ...eventData,
      userId: calendar.userId,
      startsAt: new Date(eventData.startsAt),
      endsAt: new Date(eventData.endsAt),
      repeatEndsAt: eventData.repeatEndsAt ? new Date(eventData.repeatEndsAt) : undefined,
    });
  }

  return events;
};
