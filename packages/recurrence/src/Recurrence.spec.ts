/// <reference types="vitest" />

import { toLocalTime } from '../../shared-common/src/Helpers';
import { Recurrence, RecurrenceIntervalEnum } from './Recurrence';

describe('Recurrence.ts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    // Hourly
    {
      testName: 'should work when hourly interval #1',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-01-01T01:00:00.000',
        humanText: 'every hour starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when hourly interval #2',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 4,
      },
      expected: {
        nextDate: '2020-01-01T04:00:00.000',
        humanText: 'every 4 hours starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when hourly interval #3',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 1,
        hoursOfDayOnly: [2, 3],
      },
      expected: {
        nextDate: '2020-01-01T02:00:00.000',
        humanText: 'every hour at 2:00, 3:00 starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when hourly interval #4',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 1,
        hoursOfDayOnly: [2, 3],
        daysOfWeekOnly: [6],
      },
      expected: {
        nextDate: '2020-01-04T02:00:00.000',
        humanText: 'every hour on Saturday at 2:00, 3:00 starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when hourly interval #5',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 1,
        hoursOfDayOnly: [2, 3],
        daysOfWeekOnly: [3],
        daysOfMonthOnly: [15],
      },
      expected: {
        nextDate: '2020-01-15T02:00:00.000',
        humanText:
          'every hour on Wednesday at 2:00, 3:00 on the 15th of the month starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    // Daily
    {
      testName: 'should work when daily interval #1',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-01-02T00:00:00.000',
        humanText: 'every day starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when daily interval #2',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 3,
      },
      expected: {
        nextDate: '2020-01-04T00:00:00.000',
        humanText: 'every 3 days starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when daily interval #3',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 5,
      },
      expected: {
        nextDates: [
          '2020-01-02T00:00:00.000',
          '2020-01-03T00:00:00.000',
          '2020-01-04T00:00:00.000',
          '2020-01-05T00:00:00.000',
          '2020-01-06T00:00:00.000',
        ],
      },
    },
    {
      testName: 'should work when daily interval #4',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 10,
        endsAt: new Date('2020-01-08T00:00:00.000'),
      },
      expected: {
        nextDates: [
          '2020-01-02T00:00:00.000',
          '2020-01-03T00:00:00.000',
          '2020-01-04T00:00:00.000',
          '2020-01-05T00:00:00.000',
          '2020-01-06T00:00:00.000',
          '2020-01-07T00:00:00.000',
          '2020-01-08T00:00:00.000',
        ],
      },
    },
    {
      testName: 'should work when daily interval #5',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-06T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 10,
        endsAt: new Date('2020-01-08T00:00:00.000'),
      },
      expected: {
        nextDates: ['2020-01-07T00:00:00.000', '2020-01-08T00:00:00.000'],
      },
    },
    {
      testName: 'should work when daily interval #6',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-06T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 10,
      },
      expected: {
        nextDate: '2020-01-07T00:00:00.000',
      },
    },
    {
      testName: 'should work when daily interval #7',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-06T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-01-07T00:00:00.000',
      },
    },
    {
      testName: 'should work when daily interval #8',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000', // Those 2 dates are only needed if we have dates between
      endDate: '2020-01-12T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-08T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
      },
      expected: {
        datesBetween: [
          '2020-01-09T00:00:00.000',
          '2020-01-10T00:00:00.000',
          '2020-01-11T00:00:00.000',
          '2020-01-12T00:00:00.000',
        ],
      },
    },
    {
      testName: 'should work when daily interval #9',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2020-01-12T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-08T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        endsAt: new Date('2020-01-10T00:00:00.000'),
      },
      expected: {
        datesBetween: ['2020-01-09T00:00:00.000', '2020-01-10T00:00:00.000'],
      },
    },
    {
      testName: 'should work when daily interval #10',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2020-01-12T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-08T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 4,
        endsAt: new Date('2020-01-10T00:00:00.000'),
      },
      expected: {
        datesBetween: ['2020-01-09T00:00:00.000', '2020-01-10T00:00:00.000'],
      },
    },
    {
      testName: 'should work when daily interval #11',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2020-01-12T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-08T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 1,
        endsAt: new Date('2020-01-10T00:00:00.000'),
      },
      expected: {
        datesBetween: ['2020-01-09T00:00:00.000'],
      },
    },
    {
      testName: 'should work when daily interval #12',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000', // Those 2 dates are only needed if we have dates between
      endDate: '2020-01-12T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-08T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 3,
      },
      expected: {
        datesBetween: [
          '2020-01-09T00:00:00.000',
          '2020-01-10T00:00:00.000',
          '2020-01-11T00:00:00.000',
        ],
      },
    },
    {
      testName: 'should work when daily interval #13',
      now: '2020-01-14T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-14T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 3,
      },
      expected: {
        nextDate: '2020-01-15T00:00:00.000',
      },
    },
    {
      testName: 'should work when daily interval #14',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-06T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        endsAt: new Date('2020-01-08T00:00:00.000'),
      },
      expected: {
        nextDate: '2020-01-07T00:00:00.000',
      },
    },
    {
      testName: 'should work when daily interval #15',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-06T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 10,
        endsAt: new Date('2020-01-08T00:00:00.000'),
      },
      expected: {
        nextDates: ['2020-01-07T00:00:00.000', '2020-01-08T00:00:00.000'],
      },
    },
    // Weekly
    {
      testName: 'should work when weekly interval #1',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.WEEK,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-01-08T00:00:00.000',
        humanText: 'every week starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when weekly interval #2',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.WEEK,
        intervalAmount: 2,
      },
      expected: {
        nextDate: '2020-01-15T00:00:00.000',
        humanText: 'every 2 weeks starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    // Monthly
    {
      testName: 'should work when monthly interval #1',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.MONTH,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-02-01T00:00:00.000',
        humanText: 'every month starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when monthly interval #2',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.MONTH,
        intervalAmount: 2,
      },
      expected: {
        nextDate: '2020-03-01T00:00:00.000',
        humanText: 'every 2 months starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    // Yearly
    {
      testName: 'should work when yearly interval #1',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.YEAR,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2021-01-01T00:00:00.000',
        humanText: 'every year starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when yearly interval #2',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000'),
        interval: RecurrenceIntervalEnum.YEAR,
        intervalAmount: 2,
      },
      expected: {
        nextDate: '2022-01-01T00:00:00.000',
        humanText: 'every 2 years starting 1/1/2020',
      },
      throwsErrorMessage: undefined,
    },
    // Errors
    {
      testName: 'should throw error if invalid startsAt',
      now: '2020-01-01T00:00:00.000',
      options: {
        startsAt: new Date('2019-01-01T002:00:00.000'), // Mind the wrong format
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
      },
      throwsErrorMessage: 'Invalid start date',
    },
  ])(`$testName`, async ({ now, startDate, endDate, options, expected, throwsErrorMessage }) => {
    const nowDate = new Date(now);
    vitest.setSystemTime(now);

    if (throwsErrorMessage) {
      expect(() => new Recurrence(options)).toThrow(throwsErrorMessage);

      return;
    }

    const recurrence = new Recurrence(options);

    if (expected?.nextDate) {
      expect(toLocalTime(recurrence.getNextDate(nowDate)!)).toEqual(expected.nextDate);
    }

    if (expected?.humanText) {
      expect(recurrence.toHumanText()).toEqual(expected.humanText);
    }

    if (expected?.nextDates) {
      const dates = recurrence.getNextDates(nowDate, options.count!);
      expect(dates.map((date) => toLocalTime(date))).toEqual(expected.nextDates);
    }

    if (expected?.datesBetween) {
      const dates = recurrence.getDatesBetween(new Date(startDate!), new Date(endDate!));
      expect(dates.map((date) => toLocalTime(date))).toEqual(expected.datesBetween);
    }
  });
});
