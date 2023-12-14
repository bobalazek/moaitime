import {
  addDays,
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
  EventInterface,
  EventWithVerticalPosition,
  ResponseInterface,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const loadEvents = async () => {
  const response = await fetchJson<ResponseInterface<EventInterface[]>>(
    `${API_URL}/api/v1/events`,
    {
      method: 'GET',
    }
  );

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
  events: EventInterface[],
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
        const eventStartDate = format(eventStart, 'yyyy-MM-dd');
        const eventEndDate = format(eventEnd, 'yyyy-MM-dd');
        const queriedDate = format(day, 'yyyy-MM-dd');

        return queriedDate >= eventStartDate && queriedDate <= eventEndDate;
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

  const layoutEvents = (events: EventInterface[]): EventWithVerticalPosition[] => {
    const eventStacks: EventInterface[][] = [];
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
