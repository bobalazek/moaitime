/// <reference types="vitest" />

import { zonedTimeToUtc } from 'date-fns-tz';

import { CalendarEntryTypeEnum } from '@moaitime/shared-common';

import { getCalendarEntriesForDay, getCalendarEntriesWithStyles } from './CalendarHelpers';

describe('CalendarHelpers.ts', () => {
  describe('getCalendarEntriesForDay()', () => {
    it('should return all calendar entries for the day', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T11:00:00.000',
            startsAtUtc: '2023-12-20T11:00:00.000Z',
            endsAt: '2023-12-20T12:00:00.000',
            endsAtUtc: '2023-12-20T12:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T12:00:00.000',
            startsAtUtc: '2023-12-20T12:00:00.000Z',
            endsAt: '2023-12-20T13:00:00.000',
            endsAtUtc: '2023-12-20T13:00:00.000Z',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T13:00:00.000',
            startsAtUtc: '2023-12-20T13:00:00.000Z',
            endsAt: '2023-12-20T14:00:00.000',
            endsAtUtc: '2023-12-20T14:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'all'
      );

      expect(result).toHaveLength(3);

      expect(result[0].id).toBe('event-1');
      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');

      expect(result[1].id).toBe('event-2');
      expect(result[1].left).toBe('0%');
      expect(result[1].width).toBe('100%');

      expect(result[2].id).toBe('event-3');
      expect(result[2].left).toBe('0%');
      expect(result[2].width).toBe('100%');
    });

    it('should return all calendar entries for the day in the correct order', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T15:00:00.000',
            startsAtUtc: '2023-12-20T15:00:00.000Z',
            endsAt: '2023-12-20T18:00:00.000',
            endsAtUtc: '2023-12-20T18:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T12:00:00.000',
            startsAtUtc: '2023-12-20T12:00:00.000Z',
            endsAt: '2023-12-20T13:00:00.000',
            endsAtUtc: '2023-12-20T13:00:00.000Z',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000',
            startsAtUtc: '2023-12-20T20:00:00.000Z',
            endsAt: '2023-12-20T21:00:00.000',
            endsAtUtc: '2023-12-20T21:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'all'
      );

      expect(result).toHaveLength(3);

      expect(result[0].id).toBe('event-1');
      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');

      expect(result[1].id).toBe('event-3');
      expect(result[1].left).toBe('0%');
      expect(result[1].width).toBe('100%');

      expect(result[2].id).toBe('event-2');
      expect(result[2].left).toBe('50%');
      expect(result[2].width).toBe('50%');
    });

    it('should return full day only calendar entries', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            timezone: 'UTC',
            color: null,
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000',
            startsAtUtc: '2023-12-20T20:00:00.000Z',
            endsAt: '2023-12-20T21:00:00.000',
            endsAtUtc: '2023-12-20T21:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(result).toHaveLength(2);

      expect(result.map((event) => event.id)).toEqual(['event-1', 'event-2']);

      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');

      expect(result[1].left).toBe('0%');
      expect(result[1].width).toBe('100%');
    });

    it('should return non full day calendar entries only', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000',
            startsAtUtc: '2023-12-20T20:00:00.000Z',
            endsAt: '2023-12-20T21:00:00.000',
            endsAtUtc: '2023-12-20T21:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'without-full-day'
      );

      expect(result).toHaveLength(1);

      expect(result.map((event) => event.id)).toEqual(['event-3']);

      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');
    });

    it('should correctly return the calendar entry if adjusted for the EST timezone early day', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T02:00:00.000', // That is 19th Dec 9pm EST
            startsAtUtc: '2023-12-20T02:00:00.000Z',
            endsAt: '2023-12-20T04:00:00.000',
            endsAtUtc: '2023-12-20T04:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T10:00:00.000', // That is 20th Dec 5am EST
            startsAtUtc: '2023-12-20T10:00:00.000Z',
            endsAt: '2023-12-20T11:00:00.000',
            endsAtUtc: '2023-12-20T11:00:00.000Z',
          },
        ],
        'America/New_York', // GMT-5
        'without-full-day'
      );

      expect(result).toHaveLength(1);

      expect(result.map((event) => event.id)).toEqual(['event-2']);

      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');
    });

    it('should correctly return the calendar entry if adjusted for the EST timezone late day', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T23:00:00.000', // That is 20th Dec 6pm EST
            startsAtUtc: '2023-12-20T23:00:00.000Z',
            endsAt: '2023-12-20T23:30:00.000',
            endsAtUtc: '2023-12-20T23:30:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-21T03:00:00.000', // That is 20th Dec 10pm EST
            startsAtUtc: '2023-12-21T03:00:00.000Z',
            endsAt: '2023-12-21T04:00:00.000',
            endsAtUtc: '2023-12-21T04:00:00.000Z',
          },
        ],
        'America/New_York', // GMT-5
        'without-full-day'
      );

      expect(result).toHaveLength(2);

      expect(result.map((event) => event.id)).toEqual(['event-1', 'event-2']);

      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');

      expect(result[1].left).toBe('0%');
      expect(result[1].width).toBe('100%');
    });

    it('should return all matching full day calendar etnries', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000',
            startsAtUtc: '2023-12-19T00:00:00.000Z',
            endsAt: '2023-12-22T00:00:00.000',
            endsAtUtc: '2023-12-22T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(result).toHaveLength(3);

      expect(result.map((event) => event.id)).toEqual(['event-1', 'event-2', 'event-3']);
    });

    it('should return only the correct full day calendar entries before 20th december', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-19',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000',
            startsAtUtc: '2023-12-19T00:00:00.000Z',
            endsAt: '2023-12-22T00:00:00.000',
            endsAtUtc: '2023-12-22T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(result).toHaveLength(1);

      expect(result.map((event) => event.id)).toEqual(['event-3']);

      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');
    });

    it('should return only the correct full day calendar entries after 20th december', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-21',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            startsAtUtc: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T00:00:00.000',
            endsAtUtc: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000',
            startsAtUtc: '2023-12-19T00:00:00.000Z',
            endsAt: '2023-12-22T00:00:00.000',
            endsAtUtc: '2023-12-22T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(result).toHaveLength(1);

      expect(result.map((event) => event.id)).toEqual(['event-3']);

      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');
    });

    it('should correctly group events together', () => {
      const result = getCalendarEntriesForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T12:00:00.000',
            startsAtUtc: '2023-12-20T12:00:00.000Z',
            endsAt: '2023-12-20T13:00:00.000',
            endsAtUtc: '2023-12-20T13:00:00.000Z',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T16:00:00.000',
            startsAtUtc: '2023-12-20T16:00:00.000Z',
            endsAt: '2023-12-20T18:00:00.000',
            endsAtUtc: '2023-12-20T18:00:00.000Z',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T16:00:00.000',
            startsAtUtc: '2023-12-20T16:00:00.000Z',
            endsAt: '2023-12-20T18:00:00.000',
            endsAtUtc: '2023-12-20T18:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'all'
      );

      expect(result).toHaveLength(3);

      expect(result.map((event) => event.id)).toEqual(['event-1', 'event-2', 'event-3']);

      expect(result[0].left).toBe('0%');
      expect(result[0].width).toBe('100%');

      expect(result[1].left).toBe('0%');
      expect(result[1].width).toBe('50%');

      expect(result[2].left).toBe('50%');
      expect(result[2].width).toBe('50%');
    });
  });

  describe('getCalendarEntriesWithStyles()', () => {
    it('should correctly calculate the height', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T08:00:00.000',
            startsAtUtc: '2023-12-20T08:00:00.000Z',
            endsAt: '2023-12-20T09:00:00.000',
            endsAtUtc: '2023-12-20T09:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'UTC',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('800px');
      expect(result[0].style.height).toBe('100px');
    });

    it('should correctly calculate the height if overflowing from the previous day', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-19T23:00:00.000',
            startsAtUtc: '2023-12-19T23:00:00.000Z',
            endsAt: '2023-12-20T02:00:00.000',
            endsAtUtc: '2023-12-20T02:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'UTC',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('0px');
      expect(result[0].style.height).toBe('200px');
    });

    it('should correctly calculate the height if overflowing to the next day', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T23:00:00.000',
            startsAtUtc: '2023-12-20T23:00:00.000Z',
            endsAt: '2023-12-21T02:00:00.000',
            endsAtUtc: '2023-12-21T02:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'UTC',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('2300px');
      expect(result[0].style.height).toBe('100px');
    });

    it('should correctly calculate the height if overflowing from the previous day if moscow time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-19T23:00:00.000', // That is 20th Dec 2am Moscow time
            startsAtUtc: '2023-12-19T23:00:00.000Z',
            endsAt: '2023-12-20T02:00:00.000',
            endsAtUtc: '2023-12-20T02:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'Europe/Moscow',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('200px');
      expect(result[0].style.height).toBe('300px');
    });

    it('should correctly calculate the height if overflowing to the next day if moscow time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000', // That is 20th Dec 11pm Moscow time
            startsAtUtc: '2023-12-20T20:00:00.000Z',
            endsAt: '2023-12-21T02:00:00.000',
            endsAtUtc: '2023-12-21T02:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'Europe/Moscow',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('2300px');
      expect(result[0].style.height).toBe('100px');
    });

    it('should correctly calculate the height if overflowing from the previous day if los angeles time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T02:00:00.000', // That is 19th Dec 8pm Los Angeles time
            startsAtUtc: '2023-12-20T02:00:00.000Z',
            endsAt: '2023-12-20T12:00:00.000', // That is 20th Dec 4am Los Angeles time
            endsAtUtc: '2023-12-20T12:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'America/Los_Angeles',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('0px');
      expect(result[0].style.height).toBe('400px');
    });

    it('should correctly calculate the height if overflowing from the next day if los angeles time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-21T04:00:00.000', // That is 20th Dec 8pm Los Angeles time
            startsAtUtc: '2023-12-21T04:00:00.000Z',
            endsAt: '2023-12-21T12:00:00.000', // That is 21th Dec 4am Los Angeles time
            endsAtUtc: '2023-12-21T12:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'America/Los_Angeles',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('2000px');
      expect(result[0].style.height).toBe('400px');
    });

    it('should correctly calculate the height if it is los angeles time and event also being los angeles time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'America/Los_Angeles',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T04:00:00.000',
            startsAtUtc: '2023-12-20T04:00:00.000Z',
            endsAt: '2023-12-20T12:00:00.000',
            endsAtUtc: '2023-12-20T12:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'America/Los_Angeles',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('400px');
      expect(result[0].style.height).toBe('800px');
    });

    it('should correctly calculate the height if overflowing from the previous day if sydney time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-19T10:00:00.000', // That is 19th Dec 9pm Sydney time
            startsAtUtc: '2023-12-19T10:00:00.000Z',
            endsAt: '2023-12-19T17:00:00.000', // That is 20th Dec 4am Sydney time
            endsAtUtc: '2023-12-19T17:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'Australia/Sydney',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('0px');
      expect(result[0].style.height).toBe('400px');
    });

    it('should correctly calculate the height if overflowing from the next day if sydney time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T09:00:00.000', // That is 20th Dec 8pm Sydney time
            startsAtUtc: '2023-12-20T09:00:00.000Z',
            endsAt: '2023-12-20T18:00:00.000', // That is 21th Dec 4am Sydney time
            endsAtUtc: '2023-12-20T18:00:00.000Z',
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'Australia/Sydney',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('2000px');
      expect(result[0].style.height).toBe('400px');
    });

    it('should correctly calculate the height if it is sydney time and the event also being sydney time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'Australia/Sydney',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T09:00:00.000',
            startsAtUtc: zonedTimeToUtc(
              '2023-12-20T09:00:00.000',
              'Australia/Sydney'
            ).toISOString(),
            endsAt: '2023-12-20T18:00:00.000',
            endsAtUtc: zonedTimeToUtc('2023-12-20T18:00:00.000', 'Australia/Sydney').toISOString(),
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'Australia/Sydney',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('900px');
      expect(result[0].style.height).toBe('900px');
    });

    it('should correctly calculate the height if it is sydney time and the event also being sydney time while ending with perth time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            color: null,
            timezone: 'Australia/Sydney',
            endTimezone: 'Australia/Perth',
            isAllDay: false,
            startsAt: '2023-12-20T09:00:00.000',
            startsAtUtc: zonedTimeToUtc(
              '2023-12-20T09:00:00.000',
              'Australia/Sydney'
            ).toISOString(),
            endsAt: '2023-12-20T18:00:00.000',
            endsAtUtc: zonedTimeToUtc('2023-12-20T18:00:00.000', 'Australia/Perth').toISOString(),
            left: '0%',
            width: '100%',
          },
        ],
        '2023-12-20',
        'Australia/Sydney',
        100
      );

      expect(result).toHaveLength(1);
      expect(result[0].style.top).toBe('900px');
      expect(result[0].style.height).toBe('1200px');
    });
  });
});
