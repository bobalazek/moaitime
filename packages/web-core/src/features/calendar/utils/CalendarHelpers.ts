import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import {
  API_URL,
  Calendar,
  CalendarEntry,
  CalendarEntryWithVerticalPosition,
  CreateEvent,
  DayOfWeek,
  Event,
  ResponseInterface,
  UpdateEvent,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Calendars **********/
export const loadCalendars = async () => {
  const response = await fetchJson<ResponseInterface<Calendar[]>>(`${API_URL}/api/v1/calendars`, {
    method: 'GET',
  });

  return response.data as Calendar[];
};

/********** Calendar Entries **********/
export const loadCalendarEntries = async (from?: Date | string, to?: Date | string) => {
  const url = new URL(`${API_URL}/api/v1/calendar-entries`);
  if (from) {
    url.searchParams.append('from', from instanceof Date ? from.toISOString() : from);
  }

  if (to) {
    url.searchParams.append('to', to instanceof Date ? to.toISOString() : to);
  }

  const response = await fetchJson<ResponseInterface<CalendarEntry[]>>(url.toString(), {
    method: 'GET',
  });

  return response;
};

/********** Events **********/
export const addEvent = async (event: CreateEvent): Promise<Event> => {
  const response = await fetchJson<ResponseInterface<Event>>(`${API_URL}/api/v1/events`, {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Event;
};

export const editEvent = async (eventId: string, event: UpdateEvent): Promise<Event> => {
  const response = await fetchJson<ResponseInterface<Event>>(
    `${API_URL}/api/v1/events/${eventId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(event),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Event;
};

export const deleteEvent = async (eventId: string, isHardDelete?: boolean): Promise<Event> => {
  const response = await fetchJson<ResponseInterface<Event>>(
    `${API_URL}/api/v1/events/${eventId}`,
    {
      method: 'DELETE',
      body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Event;
};

/********** Misc **********/
export const getDatesForRange = (start: string, end: string) => {
  const range: string[] = [];
  const endDate = new Date(end);
  let currentDate = new Date(start);
  for (; currentDate <= endDate; currentDate = addDays(currentDate, 1)) {
    range.push(format(currentDate, 'yyyy-MM-dd'));
  }

  return range;
};

export const getWeeksForMonth = (month: Date, startDayOfWeek: number) => {
  const startDay = startOfMonth(month);
  const endDay = endOfMonth(month);
  const daysInMonth = eachDayOfInterval({ start: startDay, end: endDay });
  const adjustedStartDay = getDay(startDay) - startDayOfWeek;
  const startPadding = adjustedStartDay < 0 ? 7 - Math.abs(adjustedStartDay) : adjustedStartDay;
  const emptyStartDays = Array.from({ length: startPadding }, (_, i) =>
    subDays(startDay, startPadding - i)
  );
  const totalDays = daysInMonth.length + emptyStartDays.length;
  const remainingDays = totalDays % 7;
  const daysAfterEndOfMonth = remainingDays === 0 ? 0 : 7 - remainingDays;
  const emptyEndDays = Array.from({ length: daysAfterEndOfMonth }, (_, i) =>
    addDays(endDay, i + 1)
  );
  const daysToDisplay = [...emptyStartDays, ...daysInMonth, ...emptyEndDays];

  const weeks = [];
  for (let i = 0; i < daysToDisplay.length; i += 7) {
    weeks.push(daysToDisplay.slice(i, i + 7));
  }

  return weeks;
};

/**
 * @param date this is the zone-adjusted date that we want to get the calendar entries for
 * @param calendarEntries the collection of the calendar entries that we want to filter
 * @param timezone the timezone that we want to use to adjust the dates
 * @param type the type of the calendar entries that we want to get
 * @returns the sorted collection of the calendar entries for the given day
 */
export const getCalendarEntriesForDay = (
  date: string,
  calendarEntries: CalendarEntry[],
  timezone: string,
  type: 'all' | 'without-full-day' | 'full-day-only' = 'all'
): CalendarEntryWithVerticalPosition[] => {
  const day = new Date(date);
  const start = startOfDay(day);
  const end = endOfDay(day);

  const filteredCalendarEntries = calendarEntries
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .filter((calendarEntry) => {
      const calendarEntryStart = utcToZonedTime(calendarEntry.startsAt, timezone);
      const calendarEntryEnd = utcToZonedTime(calendarEntry.endsAt, timezone);

      if (calendarEntry.isAllDay) {
        const dates = getDatesForRange(calendarEntry.startsAt, calendarEntry.endsAt);

        return dates.some((single) => single === date);
      }

      return calendarEntryStart < end && calendarEntryEnd > start;
    })
    .filter((calendarEntry) => {
      return (
        type === 'all' ||
        (type === 'without-full-day' && !calendarEntry.isAllDay) ||
        (type === 'full-day-only' && calendarEntry.isAllDay)
      );
    });

  const layoutCalendarEntries = (
    calendarEntries: CalendarEntry[]
  ): CalendarEntryWithVerticalPosition[] => {
    const stacks: CalendarEntry[][] = [];
    const positionedCalendarEntries: CalendarEntryWithVerticalPosition[] = [];

    calendarEntries.forEach((calendarEntry) => {
      let placed = false;
      for (const stack of stacks) {
        const lastInStack = stack[stack.length - 1];
        if (lastInStack.endsAt <= calendarEntry.startsAt) {
          stack.push(calendarEntry);
          placed = true;
          break;
        }
      }

      if (!placed) {
        stacks.push([calendarEntry]);
      }
    });

    stacks.forEach((stack, stackIndex) => {
      stack.forEach((calendarEntry) => {
        const width = 100 / stacks.length;
        const left = width * stackIndex;

        positionedCalendarEntries.push({
          ...calendarEntry,
          left: `${left}%`,
          width: `${width}%`,
        });
      });
    });

    return positionedCalendarEntries;
  };

  return layoutCalendarEntries(filteredCalendarEntries);
};

export const getCalendarEntriesWithStyles = (
  calendarEntries: CalendarEntryWithVerticalPosition[],
  date: string,
  calendarTimezone: string,
  hourHeightPx: number
) => {
  const dayStartCalendarTZ = utcToZonedTime(new Date(`${date}T00:00:00.000Z`), calendarTimezone);
  dayStartCalendarTZ.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds to 00:00:00.000

  const dayEndCalendarTZ = new Date(dayStartCalendarTZ);
  dayEndCalendarTZ.setDate(dayEndCalendarTZ.getDate() + 1);

  console.log(`Calendar Day Start (Calendar TZ): ${dayStartCalendarTZ}`);
  console.log(`Calendar Day End (Calendar TZ): ${dayEndCalendarTZ}`);

  return calendarEntries.map((calendarEntry) => {
    const eventStartTimezone = calendarEntry.timezone;
    const eventEndTimezone = calendarEntry.endTimezone ?? eventStartTimezone;

    const eventStartCalendarTZ = utcToZonedTime(
      zonedTimeToUtc(calendarEntry.startsAt, eventStartTimezone),
      calendarTimezone
    );
    const eventEndCalendarTZ = utcToZonedTime(
      zonedTimeToUtc(calendarEntry.endsAt, eventEndTimezone),
      calendarTimezone
    );

    console.log(`Event Start (Calendar TZ): ${eventStartCalendarTZ}`);
    console.log(`Event End (Calendar TZ): ${eventEndCalendarTZ}`);

    const eventStartClamped =
      eventStartCalendarTZ < dayStartCalendarTZ ? dayStartCalendarTZ : eventStartCalendarTZ;
    const eventEndClamped =
      eventEndCalendarTZ > dayEndCalendarTZ ? dayEndCalendarTZ : eventEndCalendarTZ;

    console.log(`Clamped Start: ${eventStartClamped}`);
    console.log(`Clamped End: ${eventEndClamped}`);

    const topTimeDelta = eventStartClamped.getTime() - dayStartCalendarTZ.getTime();
    const top = Math.round((topTimeDelta / (1000 * 60 * 60)) * hourHeightPx);

    const heightTimeDelta = eventEndClamped.getTime() - eventStartClamped.getTime();
    const height = Math.round((heightTimeDelta / (1000 * 60 * 60)) * hourHeightPx);

    console.log(`Calculated Top: ${top}px`);
    console.log(`Calculated Height: ${height}px`);

    const style = {
      top: `${top}px`,
      height: `${height}px`,
      left: calendarEntry.left,
      width: calendarEntry.width,
    };

    return { ...calendarEntry, style };
  });
};

export const getWeekRange = (date: Date, weekStartsOn: DayOfWeek) => {
  const start = startOfWeek(date, { weekStartsOn });
  const end = endOfWeek(date, { weekStartsOn });

  return { start, end };
};

export const getMonthRange = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return { start, end };
};

export const getYearRange = (date: Date) => {
  const start = startOfYear(date);
  const end = endOfYear(date);

  return { start, end };
};

export const getAgendaRange = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(addMonths(start, 2));

  return { start, end };
};

export const convertIsoStringToObject = (
  isoString?: string,
  showDateTime?: boolean,
  timezone?: string
) => {
  if (!isoString) {
    return {
      date: null,
      dateTime: null,
      dateTimeZone: null,
    };
  }

  const dateObject = new Date(isoString);

  return {
    date: format(dateObject, 'yyyy-MM-dd'),
    dateTime: showDateTime ? format(dateObject, 'HH:mm') : null,
    dateTimeZone: timezone ?? null,
  };
};

export const convertObjectToIsoString = <T extends Record<string, string | null>>(object: T) => {
  if (!object.date) {
    return undefined;
  }

  if (object.dateTime) {
    return { iso: `${object.date}T${object.dateTime}`, timezone: undefined };
  }

  return { iso: `${object.date}T00:00:00.000`, timezone: undefined };
};
