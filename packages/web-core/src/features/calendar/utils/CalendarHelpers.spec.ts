/// <reference types="vitest" />

import { getEventsForDay } from './CalendarHelpers';

describe('CalendarHelpers.ts', () => {
  describe('getEventsForDay()', () => {
    it('should return all events for the day', () => {
      const finalEvents = getEventsForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T11:00:00.000Z',
            endsAt: '2023-12-20T12:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T12:00:00.000Z',
            endsAt: '2023-12-20T13:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            title: 'Event 3',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T13:00:00.000Z',
            endsAt: '2023-12-20T14:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'all'
      );

      expect(finalEvents).toHaveLength(3);
      expect(finalEvents[0].id).toBe('event-1');
      expect(finalEvents[1].id).toBe('event-2');
      expect(finalEvents[2].id).toBe('event-3');
    });

    it('should return all events for the day in the correct order', () => {
      const finalEvents = getEventsForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T15:00:00.000Z',
            endsAt: '2023-12-20T18:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T12:00:00.000Z',
            endsAt: '2023-12-20T13:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            title: 'Event 3',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000Z',
            endsAt: '2023-12-20T21:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'all'
      );

      expect(finalEvents).toHaveLength(3);
      expect(finalEvents[0].id).toBe('event-2');
      expect(finalEvents[1].id).toBe('event-1');
      expect(finalEvents[2].id).toBe('event-3');
    });

    it('should return full day only events', () => {
      const finalEvents = getEventsForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            title: 'Event 3',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000Z',
            endsAt: '2023-12-20T21:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(finalEvents).toHaveLength(2);
      expect(finalEvents.map((event) => event.id)).toEqual(['event-1', 'event-2']);
    });

    it('should return non full day events only', () => {
      const finalEvents = getEventsForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            title: 'Event 3',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T20:00:00.000Z',
            endsAt: '2023-12-20T21:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'without-full-day'
      );

      expect(finalEvents).toHaveLength(1);
      expect(finalEvents.map((event) => event.id)).toEqual(['event-3']);
    });

    it('should correctly return the event if adjusted for the EST timezone early day', () => {
      const finalEvents = getEventsForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T02:00:00.000Z', // That is 19th Dec 9pm EST
            endsAt: '2023-12-20T04:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T10:00:00.000Z', // That is 20th Dec 5am EST
            endsAt: '2023-12-20T11:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'America/New_York', // GMT-5
        'without-full-day'
      );

      expect(finalEvents).toHaveLength(1);
      expect(finalEvents.map((event) => event.id)).toEqual(['event-2']);
    });

    it('should correctly return the event if adjusted for the EST timezone late day', () => {
      const finalEvents = getEventsForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-20T23:00:00.000Z', // That is 20th Dec 6pm EST
            endsAt: '2023-12-20T23:30:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: false,
            startsAt: '2023-12-21T03:00:00.000Z', // That is 20th Dec 10pm EST
            endsAt: '2023-12-21T04:00:00.000Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'America/New_York', // GMT-5
        'without-full-day'
      );

      expect(finalEvents).toHaveLength(2);
      expect(finalEvents.map((event) => event.id)).toEqual(['event-1', 'event-2']);
    });

    it('should return all matching full day events', () => {
      const finalEvents = getEventsForDay(
        '2023-12-20',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            title: 'Event 3',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000Z',
            endsAt: '2023-12-22T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(finalEvents).toHaveLength(3);
      expect(finalEvents.map((event) => event.id)).toEqual(['event-3', 'event-1', 'event-2']);
    });

    it('should return only the correct full day events before 20th december', () => {
      const finalEvents = getEventsForDay(
        '2023-12-19',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            title: 'Event 3',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000Z',
            endsAt: '2023-12-22T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(finalEvents).toHaveLength(1);
      expect(finalEvents.map((event) => event.id)).toEqual(['event-3']);
    });

    it('should return only the correct full day events after 20th december', () => {
      const finalEvents = getEventsForDay(
        '2023-12-21',
        [
          {
            id: 'event-1',
            title: 'Event 1',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-2',
            title: 'Event 2',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-20T00:00:00.000Z',
            endsAt: '2023-12-20T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: 'event-3',
            title: 'Event 3',
            description: '',
            isAllDay: true,
            startsAt: '2023-12-19T00:00:00.000Z',
            endsAt: '2023-12-22T23:59:59.999Z',
            deletedAt: null,
            createdAt: '2023-12-20T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
        ],
        'Europe/Berlin',
        'full-day-only'
      );

      expect(finalEvents).toHaveLength(1);
      expect(finalEvents.map((event) => event.id)).toEqual(['event-3']);
    });
  });
});
