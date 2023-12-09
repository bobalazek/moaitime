import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { getDatabase, NewEvent } from '@myzenbuddy/database-core';

export const getEventFixtures = async (): Promise<NewEvent[]> => {
  const calendars = await getDatabase().query.calendars.findMany();
  const now = new Date();

  const events: NewEvent[] = [];
  for (const calendar of calendars) {
    const calendarId = calendar.id;
    const timezone = calendar.timezone ?? 'UTC';
    const todaysDate = format(now, 'yyyy-MM-dd');

    events.push(
      ...[
        {
          title: 'Event 1',
          description: 'Event 1 Description',
          timezone,
          isAllDay: false,
          startsAt: zonedTimeToUtc(`${todaysDate}T12:00:00.000`, timezone),
          endsAt: zonedTimeToUtc(`${todaysDate}T13:00:00.000`, timezone),
          calendarId,
        },
        {
          title: 'Event 2',
          description: 'Event 2 Description',
          timezone,
          isAllDay: false,
          startsAt: zonedTimeToUtc(`${todaysDate}T14:00:00.000`, timezone),
          endsAt: zonedTimeToUtc(`${todaysDate}T17:00:00.000`, timezone),
          calendarId,
        },
        {
          title: 'Event 3 Overlap',
          timezone,
          description: 'Event 3 Description',
          isAllDay: false,
          startsAt: zonedTimeToUtc(`${todaysDate}T12:00:00.000`, timezone),
          endsAt: zonedTimeToUtc(`${todaysDate}T19:00:00.000`, timezone),
          calendarId,
        },
        {
          title: 'Event 4 Overlap',
          description: 'Event 4 Description',
          timezone,
          isAllDay: false,
          startsAt: zonedTimeToUtc(`${todaysDate}T10:00:00.000`, timezone),
          endsAt: zonedTimeToUtc(`${todaysDate}T20:00:00.000`, timezone),
          calendarId,
        },
        {
          title: 'Event Full Day',
          description: 'Event Full Day Description',
          timezone,
          isAllDay: true,
          startsAt: zonedTimeToUtc(`${todaysDate}T00:00:00.000`, timezone),
          endsAt: zonedTimeToUtc(`${todaysDate}T23:59:59.999`, timezone),
          calendarId,
        },
        {
          title: 'Second Event Full Day',
          description: 'Second Event Full Day Description',
          timezone,
          isAllDay: true,
          startsAt: zonedTimeToUtc(`${todaysDate}T00:00:00.000`, timezone),
          endsAt: zonedTimeToUtc(`${todaysDate}T23:59:59.999`, timezone),
          calendarId,
        },
      ]
    );
  }

  return events;
};
