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
      testName: 'should work hourly',
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
    },
    {
      testName: 'should work every 4 hours',
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
    },
    {
      testName: 'should work hourly but only at 2:00 and 3:00',
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
    },
    {
      testName: 'should work hourly but only at 2:00 and 3:00 on a Saturday',
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
    },
    {
      testName:
        'should work hourly but only at 2:00 and 3:00 on a Wednesday and the 15th of the month',
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
    },
    // Daily
    {
      testName: 'should work daily',
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
    },
    {
      testName: 'should work every 3 days',
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
    },
    {
      testName: 'should work daily but only 5 iterations',
      now: '2020-01-01T00:00:00.000',
      count: 5,
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
      testName:
        'should work when daily with 10 iterations and an end date earlier than the 10th iteration',
      now: '2020-01-01T00:00:00.000',
      count: 10,
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
      testName:
        'should work when daily with 10 iterations starting after now and an end date only 2 iterations after the start date',
      now: '2020-01-01T00:00:00.000',
      count: 10,
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
      testName: 'should work daily with only the next date',
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
      testName: 'should work daily with dates between',
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
      testName: 'should work daily with dates between and an end date option',
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
      testName: 'should work daily with dates between and an end date option and 4 iterations',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2020-01-12T00:00:00.000',
      count: 4,
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
      testName: 'should work daily with dates between and an end date option and 1 iteration',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2020-01-12T00:00:00.000',
      count: 1,
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
      testName: 'should work daily with dates between and an count option',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2020-01-12T00:00:00.000',
      count: 3,
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
      testName: 'should work weekly with dates between and an count option',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2022-02-12T00:00:00.000',
      count: 3,
      options: {
        startsAt: new Date('2020-01-08T00:00:00.000'),
        interval: RecurrenceIntervalEnum.WEEK,
        intervalAmount: 1,
        count: 3,
      },
      expected: {
        datesBetween: [
          '2020-01-15T00:00:00.000',
          '2020-01-22T00:00:00.000',
          '2020-01-29T00:00:00.000',
        ],
      },
    },
    {
      testName: 'should work monthly with dates between and an count option',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2022-05-12T00:00:00.000',
      count: 3,
      options: {
        startsAt: new Date('2020-01-08T00:00:00.000'),
        interval: RecurrenceIntervalEnum.MONTH,
        intervalAmount: 1,
        count: 3,
      },
      expected: {
        datesBetween: [
          '2020-02-08T00:00:00.000',
          '2020-03-08T00:00:00.000',
          '2020-04-08T00:00:00.000',
        ],
      },
    },
    {
      testName: 'should work yearly with dates between and an count option and 1 iteration',
      now: '2020-01-01T00:00:00.000',
      startDate: '2020-01-02T00:00:00.000',
      endDate: '2021-01-12T00:00:00.000',
      count: 1,
      options: {
        startsAt: new Date('2020-01-08T00:00:00.000'),
        interval: RecurrenceIntervalEnum.YEAR,
        intervalAmount: 1,
        count: 1,
      },
      expected: {
        datesBetween: ['2021-01-08T00:00:00.000'],
      },
    },
    {
      testName: 'should work daily with the next date option',
      now: '2020-01-14T00:00:00.000',
      options: {
        startsAt: new Date('2020-01-14T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-01-15T00:00:00.000',
      },
    },
    {
      testName: 'should work daily with the next date option and an end date option',
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
      testName: 'should work daily with next dates and an end date option with 10 iterations',
      now: '2020-01-01T00:00:00.000',
      count: 10,
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
      testName:
        'should work daily with 3 iterations and an end date option and only on a Wednesday',
      now: '2020-01-01T00:00:00.000',
      count: 3,
      options: {
        startsAt: new Date('2020-01-06T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 3,
        daysOfWeekOnly: [3],
      },
      expected: {
        nextDates: [
          '2020-01-08T00:00:00.000',
          '2020-01-15T00:00:00.000',
          '2020-01-22T00:00:00.000',
        ],
      },
    },
    // Weekly
    {
      testName: 'should work weekly',
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
    },
    {
      testName: 'should work every 2 weeks',
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
    },
    {
      testName: 'should work weekly but only on a Wednesday',
      now: '2020-01-01T00:00:00.000',
      count: 3,
      options: {
        startsAt: new Date('2020-01-06T00:00:00.000'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
        count: 3,
        daysOfWeekOnly: [3],
      },
      expected: {
        nextDates: [
          '2020-01-08T00:00:00.000',
          '2020-01-15T00:00:00.000',
          '2020-01-22T00:00:00.000',
        ],
      },
    },
    // Monthly
    {
      testName: 'should work monthly',
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
    },
    {
      testName: 'should work every 2 months',
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
    },
    // Yearly
    {
      testName: 'should work yearly',
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
    },
    {
      testName: 'should work every 2 years',
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
  ])(
    `$testName`,
    async ({ now, startDate, endDate, count, options, expected, throwsErrorMessage }) => {
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
        if (!count) {
          throw new Error('Count is required for nextDates test');
        }

        const dates = recurrence.getNextDates(nowDate, count);
        expect(dates.map((date) => toLocalTime(date))).toEqual(expected.nextDates);
      }

      if (expected?.datesBetween) {
        const dates = recurrence.getDatesBetween(new Date(startDate!), new Date(endDate!));
        expect(dates.map((date) => toLocalTime(date))).toEqual(expected.datesBetween);
      }
    }
  );
});
