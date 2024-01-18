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
import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import {
  API_URL,
  Calendar,
  CalendarEntry,
  CalendarEntryWithVerticalPosition,
  CalendarEntryYearlyEntry,
  CreateCalendar,
  DayOfWeek,
  ResponseInterface,
  UpdateCalendar,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Calendars **********/
export const loadCalendars = async () => {
  const response = await fetchJson<ResponseInterface<Calendar[]>>(`${API_URL}/api/v1/calendars`, {
    method: 'GET',
  });

  return response.data ?? [];
};

export const loadDeletedCalendars = async () => {
  const response = await fetchJson<ResponseInterface<Calendar[]>>(
    `${API_URL}/api/v1/calendars/deleted`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
};

export const loadPublicCalendars = async () => {
  const response = await fetchJson<ResponseInterface<Calendar[]>>(
    `${API_URL}/api/v1/calendars/public`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
};

export const addCalendar = async (calendar: CreateCalendar): Promise<Calendar> => {
  const response = await fetchJson<ResponseInterface<Calendar>>(`${API_URL}/api/v1/calendars`, {
    method: 'POST',
    body: JSON.stringify(calendar),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Calendar;
};

export const editCalendar = async (
  calendarId: string,
  calendar: UpdateCalendar
): Promise<Calendar> => {
  const response = await fetchJson<ResponseInterface<Calendar>>(
    `${API_URL}/api/v1/calendars/${calendarId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(calendar),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Calendar;
};

export const deleteCalendar = async (
  calendarId: string,
  isHardDelete?: boolean
): Promise<Calendar> => {
  const response = await fetchJson<ResponseInterface<Calendar>>(
    `${API_URL}/api/v1/calendars/${calendarId}`,
    {
      method: 'DELETE',
      body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Calendar;
};

export const undeleteCalendar = async (calendarId: string): Promise<Calendar> => {
  const response = await fetchJson<ResponseInterface<Calendar>>(
    `${API_URL}/api/v1/calendars/${calendarId}/undelete`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Calendar;
};

export const addVisibleCalendar = async (calendarId: string): Promise<Calendar> => {
  const response = await fetchJson<ResponseInterface<Calendar>>(
    `${API_URL}/api/v1/calendars/${calendarId}/add-visible`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Calendar;
};

export const removeVisibleCalendar = async (calendarId: string): Promise<Calendar> => {
  const response = await fetchJson<ResponseInterface<Calendar>>(
    `${API_URL}/api/v1/calendars/${calendarId}/remove-visible`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Calendar;
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

  return response.data ?? [];
};

export const loadCalendarEntriesYearly = async (year: number) => {
  const response = await fetchJson<ResponseInterface<CalendarEntryYearlyEntry[]>>(
    `${API_URL}/api/v1/calendar-entries/yearly?year=${year}`,
    {
      method: 'GET',
    }
  );

  return response;
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

  // Original idea from:
  // https://stackoverflow.com/questions/11311410/visualization-of-calendar-events-algorithm-to-layout-events-with-maximum-width
  // Has a bunch of tweaks and changes to make it work in typescript
  function layoutCalendarEntries(entries: CalendarEntry[]): CalendarEntryWithVerticalPosition[] {
    // Helpers
    function collidesWith(entry1: CalendarEntry, entry2: CalendarEntry): boolean {
      return (
        new Date(entry1.endsAtUtc).getTime() > new Date(entry2.startsAtUtc).getTime() &&
        new Date(entry1.startsAtUtc).getTime() < new Date(entry2.endsAtUtc).getTime()
      );
    }

    function packEvents(columns: CalendarEntryWithVerticalPosition[][]): void {
      const numColumns = columns.length;
      columns.forEach((col, iColumn) => {
        col.forEach((entry) => {
          const colSpan = expandEvent(entry, iColumn, columns);
          entry.left = ((iColumn / numColumns) * 100).toString() + '%';
          entry.width = ((colSpan / numColumns) * 100).toString() + '%';
        });
      });
    }

    function expandEvent(
      entry: CalendarEntry,
      iColumn: number,
      columns: CalendarEntry[][]
    ): number {
      let colSpan = 1;
      for (let i = iColumn + 1; i < columns.length; i++) {
        if (columns[i].some((e) => collidesWith(e, entry))) {
          break;
        }
        colSpan++;
      }
      return colSpan;
    }

    // Core logic
    const columns: CalendarEntryWithVerticalPosition[][] = [];
    const columnEndTimes: Date[] = [];

    entries.forEach((entry) => {
      const clonedEntry: CalendarEntryWithVerticalPosition = {
        ...entry,
        left: '0%',
        width: '100%',
      };

      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        if (new Date(clonedEntry.startsAtUtc) >= columnEndTimes[i]) {
          columns[i].push(clonedEntry);
          columnEndTimes[i] = new Date(clonedEntry.endsAtUtc);
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([clonedEntry]);
        columnEndTimes.push(new Date(clonedEntry.endsAtUtc));
      }
    });

    if (columns.length > 0) {
      packEvents(columns);
    }

    return columns.flat();
  }

  return layoutCalendarEntries(filteredCalendarEntries);
};

export const getCalendarEntriesWithStyles = (
  calendarEntries: CalendarEntryWithVerticalPosition[],
  date: string,
  calendarTimezone: string,
  hourHeightPx: number
) => {
  const calendarTimezoneOffset = getTimezoneOffset(calendarTimezone);
  if (calendarTimezoneOffset < 0) {
    date = format(addDays(new Date(`${date}T00:00:00.000Z`), 1), 'yyyy-MM-dd');
  }

  const dayStartCalendarTZ = utcToZonedTime(new Date(`${date}T00:00:00.000Z`), calendarTimezone);
  dayStartCalendarTZ.setHours(0, 0, 0, 0);

  const dayEndCalendarTZ = new Date(dayStartCalendarTZ);
  dayEndCalendarTZ.setDate(dayEndCalendarTZ.getDate() + 1);

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

    const eventStartClamped =
      eventStartCalendarTZ < dayStartCalendarTZ ? dayStartCalendarTZ : eventStartCalendarTZ;
    const eventEndClamped =
      eventEndCalendarTZ > dayEndCalendarTZ ? dayEndCalendarTZ : eventEndCalendarTZ;

    const topTimeDelta = eventStartClamped.getTime() - dayStartCalendarTZ.getTime();
    const top = Math.round((topTimeDelta / (1000 * 60 * 60)) * hourHeightPx);

    const heightTimeDelta = eventEndClamped.getTime() - eventStartClamped.getTime();
    const height = Math.round((heightTimeDelta / (1000 * 60 * 60)) * hourHeightPx);

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
  const start = new Date(date);
  const end = addMonths(start, 3);

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
