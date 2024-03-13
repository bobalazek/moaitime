/// <reference types="vitest" />

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
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-01-01T01:00:00.000Z',
        humanText: 'Every hour',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when hourly interval #2',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 4,
      },
      expected: {
        nextDate: '2020-01-01T04:00:00.000Z',
        humanText: 'Every 4 hours',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when hourly interval #3',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 1,
        hoursOfDayOnly: [2, 3],
      },
      expected: {
        nextDate: '2020-01-01T02:00:00.000Z',
        humanText: 'Every hour at 2:00, 3:00',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when hourly interval #4',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 1,
        hoursOfDayOnly: [2, 3],
        daysOfWeekOnly: [6],
      },
      expected: {
        nextDate: '2020-01-04T02:00:00.000Z',
        humanText: 'Every hour on Saturday at 2:00, 3:00',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when hourly interval #5',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.HOUR,
        intervalAmount: 1,
        hoursOfDayOnly: [2, 3],
        daysOfWeekOnly: [3],
        daysOfMonthOnly: [15],
      },
      expected: {
        nextDate: '2020-01-15T02:00:00.000Z',
        humanText: 'Every hour on Wednesday at 2:00, 3:00 on the 15th of the month',
      },
      throwsErrorMessage: undefined,
    },
    // Daily
    {
      testName: 'should work when daily interval #1',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-01-02T00:00:00.000Z',
        humanText: 'Every day',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when daily interval #2',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 3,
      },
      expected: {
        nextDate: '2020-01-04T00:00:00.000Z',
        humanText: 'Every 3 days',
      },
      throwsErrorMessage: undefined,
    },
    // Weekly
    {
      testName: 'should work when weekly interval #1',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.WEEK,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-01-08T00:00:00.000Z',
        humanText: 'Every week',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when weekly interval #2',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.WEEK,
        intervalAmount: 2,
      },
      expected: {
        nextDate: '2020-01-15T00:00:00.000Z',
        humanText: 'Every 2 weeks',
      },
      throwsErrorMessage: undefined,
    },
    // Monthly
    {
      testName: 'should work when monthly interval #1',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.MONTH,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2020-02-01T00:00:00.000Z',
        humanText: 'Every month',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when monthly interval #2',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.MONTH,
        intervalAmount: 2,
      },
      expected: {
        nextDate: '2020-03-01T00:00:00.000Z',
        humanText: 'Every 2 months',
      },
      throwsErrorMessage: undefined,
    },
    // Yearly
    {
      testName: 'should work when yearly interval #1',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.YEAR,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '2021-01-01T00:00:00.000Z',
        humanText: 'Every year',
      },
      throwsErrorMessage: undefined,
    },
    {
      testName: 'should work when yearly interval #2',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2020-01-01T00:00:00.000Z'),
        interval: RecurrenceIntervalEnum.YEAR,
        intervalAmount: 2,
      },
      expected: {
        nextDate: '2022-01-01T00:00:00.000Z',
        humanText: 'Every 2 years',
      },
      throwsErrorMessage: undefined,
    },
    // Errors
    {
      testName: 'should throw error if invalid startsAt',
      now: '2020-01-01T00:00:00.000Z',
      options: {
        startsAt: new Date('2019-01-01T002:00:00.000Z'), // Mind the wrong format
        interval: RecurrenceIntervalEnum.DAY,
        intervalAmount: 1,
      },
      expected: {
        nextDate: '',
        humanText: '',
      },
      throwsErrorMessage: 'Invalid start date',
    },
  ])(`$testName`, async ({ now, options, expected, throwsErrorMessage }) => {
    const nowDate = new Date(now);
    vitest.setSystemTime(now);

    if (throwsErrorMessage) {
      expect(() => new Recurrence(options)).toThrow(throwsErrorMessage);

      return;
    }

    const recurrence = new Recurrence(options);
    expect(recurrence.getNextDate(nowDate)!.toISOString()).toEqual(expected.nextDate);
    expect(recurrence.convertToHumanText()).toEqual(expected.humanText);
  });
});
