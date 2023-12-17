/// <reference types="vitest" />

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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T11:00:00.000',
            endsAt: '2023-12-20T12:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T12:00:00.000',
            endsAt: '2023-12-20T13:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T13:00:00.000',
            endsAt: '2023-12-20T14:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'Europe/Berlin',
        'all'
      );

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('event-1');
      expect(result[1].id).toBe('event-2');
      expect(result[2].id).toBe('event-3');
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T15:00:00.000',
            endsAt: '2023-12-20T18:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T12:00:00.000',
            endsAt: '2023-12-20T13:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000',
            endsAt: '2023-12-20T21:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'Europe/Berlin',
        'all'
      );

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('event-2');
      expect(result[1].id).toBe('event-1');
      expect(result[2].id).toBe('event-3');
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000',
            endsAt: '2023-12-20T21:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(result).toHaveLength(2);
      expect(result.map((event) => event.id)).toEqual(['event-1', 'event-2']);
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000',
            endsAt: '2023-12-20T21:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'Europe/Berlin',
        'without-full-day'
      );

      expect(result).toHaveLength(1);
      expect(result.map((event) => event.id)).toEqual(['event-3']);
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T02:00:00.000', // That is 19th Dec 9pm EST
            endsAt: '2023-12-20T04:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T10:00:00.000', // That is 20th Dec 5am EST
            endsAt: '2023-12-20T11:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'America/New_York', // GMT-5
        'without-full-day'
      );

      expect(result).toHaveLength(1);
      expect(result.map((event) => event.id)).toEqual(['event-2']);
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T23:00:00.000', // That is 20th Dec 6pm EST
            endsAt: '2023-12-20T23:30:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-21T03:00:00.000', // That is 20th Dec 10pm EST
            endsAt: '2023-12-21T04:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'America/New_York', // GMT-5
        'without-full-day'
      );

      expect(result).toHaveLength(2);
      expect(result.map((event) => event.id)).toEqual(['event-1', 'event-2']);
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000',
            endsAt: '2023-12-22T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(result).toHaveLength(3);
      expect(result.map((event) => event.id)).toEqual(['event-3', 'event-1', 'event-2']);
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000',
            endsAt: '2023-12-22T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(result).toHaveLength(1);
      expect(result.map((event) => event.id)).toEqual(['event-3']);
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-2',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 2',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000',
            endsAt: '2023-12-20T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
          {
            id: 'event-3',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 3',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000',
            endsAt: '2023-12-22T00:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(result).toHaveLength(1);
      expect(result.map((event) => event.id)).toEqual(['event-3']);
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T08:00:00.000',
            endsAt: '2023-12-20T09:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-19T23:00:00.000',
            endsAt: '2023-12-20T02:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T23:00:00.000',
            endsAt: '2023-12-21T02:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-19T23:00:00.000', // That is 20th Dec 2am Moscow time
            endsAt: '2023-12-20T02:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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
    /*
    it('should correctly calculate the height if overflowing to the next day if moscow time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000', // That is 20th Dec 11pm Moscow time
            endsAt: '2023-12-21T02:00:00.000',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T02:00:00.000', // That is 19th Dec 8pm Los Angeles time
            endsAt: '2023-12-20T12:00:00.000', // That is 20th Dec 4am Los Angeles time
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-21T04:00:00.000', // That is 20th Dec 8pm Los Angeles time
            endsAt: '2023-12-21T12:00:00.000', // That is 21th Dec 4am Los Angeles time
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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

    it('should correctly calculate the height if overflowing from the previous day if sydney time', () => {
      const result = getCalendarEntriesWithStyles(
        [
          {
            id: 'event-1',
            type: CalendarEntryTypeEnum.EVENT,
            title: 'Event 1',
            description: '',
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-19T10:00:00.000', // That is 19th Dec 9pm Sydney time
            endsAt: '2023-12-19T17:00:00.000', // That is 20th Dec 4am Sydney time
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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
            timezone: 'UTC',
            endTimezone: null,
            isAllDay: false,
            startsAt: '2023-12-20T09:00:00.000', // That is 20th Dec 8pm Sydney time
            endsAt: '2023-12-20T18:00:00.000', // That is 21th Dec 4am Sydney time
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
            calendarId: 'calendar-1',
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
    */
  });
});
