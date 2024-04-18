import {
  addDays,
  addMinutes,
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
import { formatInTimeZone, getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import {
  addDateTimezoneToItself,
  Calendar,
  CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
  CalendarEntry,
  CalendarEntryWithVerticalPosition,
  CalendarEntryYearlyEntry,
  CalendarViewEnum,
  CreateCalendar,
  CreateUserCalendar,
  DayOfWeek,
  Event,
  ResponseInterface,
  UpdateCalendar,
  UpdateUserCalendar,
  UserCalendar,
} from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Calendars **********/
export const getCalendars = async () => {
  const response = await fetchJson<ResponseInterface<Calendar[]>>(`${API_URL}/api/v1/calendars`, {
    method: 'GET',
  });

  return response.data ?? [];
};

export const getDeletedCalendars = async () => {
  const response = await fetchJson<ResponseInterface<Calendar[]>>(
    `${API_URL}/api/v1/calendars/deleted`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
};

export const getPublicCalendars = async () => {
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

// Visible
export const addVisibleCalendar = async (calendarId: string): Promise<Calendar> => {
  const response = await fetchJson<ResponseInterface<Calendar>>(
    `${API_URL}/api/v1/calendars/${calendarId}/visible`,
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
    `${API_URL}/api/v1/calendars/${calendarId}/visible`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Calendar;
};

/********** Calendar Entries **********/
export const getCalendarEntries = async (from?: Date | string, to?: Date | string) => {
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

export const getCalendarEntriesYearly = async (year: number) => {
  const response = await fetchJson<ResponseInterface<CalendarEntryYearlyEntry[]>>(
    `${API_URL}/api/v1/calendar-entries/yearly?year=${year}`,
    {
      method: 'GET',
    }
  );

  return response;
};

// User Calendars
export const getUserCalendars = async () => {
  const response = await fetchJson<ResponseInterface<UserCalendar[]>>(
    `${API_URL}/api/v1/user-calendars`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
};

export const addUserCalendar = async (userCalendar: CreateUserCalendar): Promise<UserCalendar> => {
  const response = await fetchJson<ResponseInterface<UserCalendar>>(
    `${API_URL}/api/v1/user-calendars`,
    {
      method: 'POST',
      body: JSON.stringify(userCalendar),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as UserCalendar;
};

export const deleteUserCalendar = async (userCalendarId: string): Promise<UserCalendar> => {
  const response = await fetchJson<ResponseInterface<UserCalendar>>(
    `${API_URL}/api/v1/user-calendars/${userCalendarId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as UserCalendar;
};

export const updateUserCalendar = async (
  userCalendarId: string,
  userCalendar: UpdateUserCalendar
): Promise<UserCalendar> => {
  const response = await fetchJson<ResponseInterface<UserCalendar>>(
    `${API_URL}/api/v1/user-calendars/${userCalendarId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(userCalendar),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as UserCalendar;
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
    let dateTime = object.dateTime;
    if (dateTime.length === 5) {
      dateTime = `${dateTime}:00.000`;
    }

    return {
      iso: `${object.date}T${dateTime}`,
      timezone: undefined,
    };
  }

  return {
    iso: `${object.date}T00:00:00.000`,
    timezone: undefined,
  };
};

// Calendar Entry
type Coordinates = {
  clientX: number;
  clientY: number;
};

/**
 * We want to show the "continued" text if the calendar entry is not an all-day event and
 * the start date is not the same as the current/today's date.
 */
export const shouldShowContinuedText = (
  calendarEntry: CalendarEntry,
  timezone: string,
  date?: string
) => {
  if (!date) {
    return false;
  }

  if (calendarEntry.isAllDay) {
    return !calendarEntry.startsAt.includes(date);
  }

  const timezonedDate = formatInTimeZone(calendarEntry.startsAt, timezone, 'yyyy-MM-dd');

  return timezonedDate !== date;
};

/**
 * This is a helper function to check if the end date of a calendar entry is the same as the
 * current/today's date. This is used to determine if we should show the resize handle or not.
 */
export const ifIsCalendarEntryEndDateSameAsToday = (
  calendarEntry: CalendarEntry,
  timezone: string,
  date?: string
) => {
  if (!date) {
    return false;
  }

  const timezonedDate = formatInTimeZone(calendarEntry.endsAt, timezone, 'yyyy-MM-dd');

  return timezonedDate === date;
};

export const getClientCoordinates = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
) => {
  if (
    typeof (event as MouseEvent).clientX !== 'undefined' &&
    typeof (event as MouseEvent).clientY !== 'undefined'
  ) {
    return {
      clientX: (event as MouseEvent).clientX,
      clientY: (event as MouseEvent).clientY,
    };
  }

  const touch = (event as TouchEvent).changedTouches[0] ?? (event as TouchEvent).touches[0];

  return {
    clientX: touch?.clientX ?? 0,
    clientY: touch?.clientY ?? 0,
  };
};

export const getRoundedMinutesFromCoordinates = (
  currentCoordinates: Coordinates,
  initialCoordinates: Coordinates,
  weekdayWidth?: number
) => {
  let minutesDelta = Math.round(
    ((currentCoordinates.clientY - initialCoordinates.clientY) /
      CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX) *
      60
  );

  if (weekdayWidth) {
    const daysDelta = Math.round(
      Math.abs(currentCoordinates.clientX - initialCoordinates.clientX) / weekdayWidth
    );
    minutesDelta +=
      (currentCoordinates.clientX > initialCoordinates.clientX ? 1 : -1) * daysDelta * 1440;
  }

  return Math.round(minutesDelta / 15) * 15;
};

export const adjustStartAndEndDates = (
  calendarEntryOrEvent: CalendarEntry | Event,
  minutesDelta: number,
  mode: 'start_and_end' | 'end_only' = 'start_and_end'
) => {
  // For some reason we are sending the endsAt as local time, not UTC,
  // but it still has a "Z" at the end. This seems to be happening on multiple places,
  // so DO NOT CHANGE THIS, else it could have negative side effects on other places.
  // The reason is, that the database stores the local time and omits the timezone.
  // What we basically do here is us getting the "correct" (local) time, with just the
  // "Z" at the end, even though it's not UTC.

  // Starts At
  const startTimezone = calendarEntryOrEvent.timezone ?? 'UTC';
  const newStartsAt = addMinutes(
    new Date(calendarEntryOrEvent.startsAt),
    mode === 'end_only' ? 0 : minutesDelta
  );
  const newStartsAtString = addDateTimezoneToItself(new Date(newStartsAt.toISOString()))
    .toISOString()
    .slice(0, -1);
  const newStartsAtUtc = zonedTimeToUtc(newStartsAt, startTimezone).toISOString();

  // Ends At
  const endTimezone = calendarEntryOrEvent.endTimezone ?? startTimezone;
  const newEndsAt = addMinutes(new Date(calendarEntryOrEvent.endsAt), minutesDelta);
  const newEndsAtString = addDateTimezoneToItself(new Date(newEndsAt.toISOString()))
    .toISOString()
    .slice(0, -1);
  const newEndsAtUtc = zonedTimeToUtc(newEndsAt, endTimezone).toISOString();

  if (newEndsAt < newStartsAt) {
    throw new Error('Ends At cannot be before Starts At');
  }

  return {
    startsAt: newStartsAtString,
    startsAtUtc: newStartsAtUtc,
    endsAt: newEndsAtString,
    endsAtUtc: newEndsAtUtc,
  };
};

export const getClosestNextHalfHour = () => {
  const now = new Date();
  const minutes = now.getMinutes();

  let halfHour = Math.ceil(minutes / 30) * 30;
  if (30 - minutes <= 5) {
    halfHour += 30;
  }

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), halfHour);
};

export const isThresholdReached = (
  currentCoordinates: Coordinates,
  initialCoordinates: Coordinates,
  threshold = 10
) => {
  return (
    Math.abs(currentCoordinates.clientX - initialCoordinates.clientX) > threshold ||
    Math.abs(currentCoordinates.clientY - initialCoordinates.clientY) > threshold
  );
};

export const getCalendarViewWidths = (selectedView: CalendarViewEnum) => {
  // Weekly/Daily
  // Figure out what the width of a weekday is, so when we move left/right,
  // we know when we jumped to the next/previous day.
  // Let's just get the first day, as they all should have the same width.
  const calendarDays = Array.from(document.querySelectorAll('div[data-calendar-day]'));

  let calendarWeekdayWidth = 0;
  if (selectedView !== CalendarViewEnum.MONTH) {
    calendarWeekdayWidth = calendarDays[0].clientWidth ?? 0;
  }

  // Monthly
  const calendarDaysOfMonthCoords: { date: string; rect: DOMRect }[] = [];
  if (selectedView == CalendarViewEnum.MONTH) {
    for (const day of calendarDays) {
      calendarDaysOfMonthCoords.push({
        date: day.getAttribute('data-calendar-day')!,
        rect: day.getBoundingClientRect(),
      });
    }
  }

  return {
    calendarWeekdayWidth,
    calendarDaysOfMonthCoords,
  };
};
