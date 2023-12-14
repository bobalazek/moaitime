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
import { utcToZonedTime } from 'date-fns-tz';

import {
  API_URL,
  DayOfWeek,
  Event,
  EventWithVerticalPosition,
  ResponseInterface,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const getDatesForRange = (start: string, end: string) => {
  const range: string[] = [];
  const endDate = new Date(end);
  let currentDate = new Date(start);
  for (; currentDate <= endDate; currentDate = addDays(currentDate, 1)) {
    range.push(format(currentDate, 'yyyy-MM-dd'));
  }

  return range;
};

export const loadEvents = async (from?: Date | string, to?: Date | string) => {
  const url = new URL(`${API_URL}/api/v1/events`);
  if (from) {
    url.searchParams.append('from', from instanceof Date ? from.toISOString() : from);
  }

  if (to) {
    url.searchParams.append('to', to instanceof Date ? to.toISOString() : to);
  }

  const response = await fetchJson<ResponseInterface<Event[]>>(url.toString(), {
    method: 'GET',
  });

  return response;
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
 * @param date this is the zone-adjusted date that we want to get the events for
 * @param events the collection of the events that we want to filter
 * @param timezone the timezone that we want to use to adjust the dates
 * @param type the type of the events that we want to get
 * @returns the sorted collection of the events for the given day
 */
export const getEventsForDay = (
  date: string,
  events: Event[],
  timezone: string,
  type: 'all' | 'without-full-day' | 'full-day-only' = 'all'
): EventWithVerticalPosition[] => {
  const day = new Date(date);
  const start = startOfDay(day);
  const end = endOfDay(day);

  const filteredEvents = events
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .filter((event) => {
      const eventStart = utcToZonedTime(event.startsAt, timezone);
      const eventEnd = utcToZonedTime(event.endsAt, timezone);

      if (event.isAllDay) {
        const dates = getDatesForRange(event.startsAt, event.endsAt);

        return dates.some((single) => single === date);
      }

      return eventStart < end && eventEnd > start;
    })
    .filter((event) => {
      return (
        type === 'all' ||
        (type === 'without-full-day' && !event.isAllDay) ||
        (type === 'full-day-only' && event.isAllDay)
      );
    });

  const layoutEvents = (events: Event[]): EventWithVerticalPosition[] => {
    const eventStacks: Event[][] = [];
    const positionedEvents: EventWithVerticalPosition[] = [];

    events.forEach((event) => {
      let placed = false;
      for (const stack of eventStacks) {
        const lastEventInStack = stack[stack.length - 1];
        if (lastEventInStack.endsAt <= event.startsAt) {
          stack.push(event);
          placed = true;
          break;
        }
      }

      if (!placed) {
        eventStacks.push([event]);
      }
    });

    eventStacks.forEach((stack, stackIndex) => {
      stack.forEach((event) => {
        const width = 100 / eventStacks.length;
        const left = width * stackIndex;

        positionedEvents.push({
          ...event,
          left,
          width,
        });
      });
    });

    return positionedEvents;
  };

  return layoutEvents(filteredEvents);
};

export const getEventsWithStyles = (
  events: EventWithVerticalPosition[],
  date: string,
  timezone: string,
  hourHeightPx: number
) => {
  const day = new Date(date);
  const startOfUtcDay = startOfDay(day);
  const endOfUtcDay = endOfDay(day);

  const timezoneOffsetStart =
    new Date(utcToZonedTime(startOfUtcDay, timezone)).getTime() - startOfUtcDay.getTime();
  const timezoneOffsetEnd =
    new Date(utcToZonedTime(endOfUtcDay, timezone)).getTime() - endOfUtcDay.getTime();

  return events.map((event) => {
    let eventStartsAt = new Date(new Date(event.startsAt).getTime() + timezoneOffsetStart);
    let eventEndsAt = new Date(new Date(event.endsAt).getTime() + timezoneOffsetEnd);

    if (eventStartsAt < startOfUtcDay) {
      eventStartsAt = startOfUtcDay;
    }

    if (eventEndsAt > endOfUtcDay) {
      eventEndsAt = endOfUtcDay;
    }

    const top = (eventStartsAt.getHours() + eventStartsAt.getMinutes() / 60) * hourHeightPx;
    const durationInHours = (eventEndsAt.getTime() - eventStartsAt.getTime()) / (1000 * 60 * 60);
    const height = Math.ceil(durationInHours * hourHeightPx);

    const style = {
      top,
      height,
      left: `${event.left}%`,
      width: `${event.width}%`,
    };

    return {
      ...event,
      style,
    };
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
