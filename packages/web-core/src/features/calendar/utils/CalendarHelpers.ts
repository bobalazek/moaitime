import {
  addDays,
  areIntervalsOverlapping,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getDay,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import {
  CalendarDayOfWeek,
  EventInterface,
  EventWithVerticalPosition,
} from '@myzenbuddy/shared-common';

export const getWeeksForMonth = (month: Date, calendarStartDayOfWeek: number) => {
  const startDay = startOfMonth(month);
  const endDay = endOfMonth(month);
  const daysInMonth = eachDayOfInterval({ start: startDay, end: endDay });
  const adjustedStartDay = getDay(startDay) - calendarStartDayOfWeek;
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
type EventWithDateObjects = Omit<EventInterface, 'startsAt' | 'endsAt'> & {
  startsAt: Date;
  endsAt: Date;
  left?: number;
  width?: number;
};

export const getEventsForDay = (
  day: Date,
  events: EventInterface[],
  timezone: string,
  type: 'all' | 'without-full-day' | 'full-day-only' = 'all'
): EventWithVerticalPosition[] => {
  const start = startOfDay(day);
  const end = endOfDay(day);

  const optimizedEvents: EventWithDateObjects[] = events
    .map((event) => ({
      ...event,
      startsAt: utcToZonedTime(new Date(event.startsAt), timezone),
      endsAt: utcToZonedTime(new Date(event.endsAt), timezone),
    }))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  const filteredEvents = optimizedEvents.filter((event) => {
    const eventStart = event.startsAt;
    const eventEnd = event.endsAt;
    const isFullDayEvent = isSameDay(eventStart, eventEnd) && event.isAllDay;

    const overlaps = areIntervalsOverlapping({ start: eventStart, end: eventEnd }, { start, end });
    const typeCheck =
      type === 'all' ||
      (type === 'without-full-day' && !isFullDayEvent) ||
      (type === 'full-day-only' && isFullDayEvent);

    return overlaps && typeCheck;
  });

  const layoutEvents = (events: EventWithDateObjects[]): EventWithVerticalPosition[] => {
    const eventStacks: EventWithDateObjects[][] = [];
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
          startsAt: event.startsAt.toISOString(),
          endsAt: event.endsAt.toISOString(),
          left,
          width,
        });
      });
    });

    return positionedEvents;
  };

  return layoutEvents(filteredEvents);
};

export const getWeekRange = (date: Date, weekStartsOn: CalendarDayOfWeek) => {
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
