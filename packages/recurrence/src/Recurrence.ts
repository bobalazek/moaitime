import { add } from 'date-fns';

import { toLocalTime } from '../../shared-common/src/Helpers';

export enum RecurrenceIntervalEnum {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum RecurrenceDayOfWeekEnum {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export type RecurrenceOptions = {
  startsAt: Date;
  interval: RecurrenceIntervalEnum;
  intervalAmount: number;
  endsAt?: Date;
  count?: number;
  hoursOfDayOnly?: number[]; // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ... 23
  daysOfWeekOnly?: RecurrenceDayOfWeekEnum[];
  daysOfMonthOnly?: number[]; // 1, 2, 3, 4, 5, 6, 7, 8, 9, ... 31
  startOfWeek?: RecurrenceDayOfWeekEnum;
  maxIterations?: number;
};

export const DAY_OF_WEEK_MAP = {
  [RecurrenceDayOfWeekEnum.SUNDAY]: 'Sunday',
  [RecurrenceDayOfWeekEnum.MONDAY]: 'Monday',
  [RecurrenceDayOfWeekEnum.TUESDAY]: 'Tuesday',
  [RecurrenceDayOfWeekEnum.WEDNESDAY]: 'Wednesday',
  [RecurrenceDayOfWeekEnum.THURSDAY]: 'Thursday',
  [RecurrenceDayOfWeekEnum.FRIDAY]: 'Friday',
  [RecurrenceDayOfWeekEnum.SATURDAY]: 'Saturday',
};

export class Recurrence {
  private _options: RecurrenceOptions;

  constructor(options: RecurrenceOptions) {
    this._validateOptions(options);

    this._options = options;
  }

  // Getters
  get options() {
    return { maxIterations: 10000, ...this._options };
  }

  updateOptions(options: Partial<RecurrenceOptions>) {
    const newOptions = {
      ...this.options,
      ...options,
    };

    this._validateOptions(newOptions);

    this._options = newOptions;

    return new Recurrence(newOptions);
  }

  toHumanText() {
    const {
      interval,
      intervalAmount,
      hoursOfDayOnly,
      daysOfWeekOnly,
      daysOfMonthOnly,
      count,
      endsAt,
      startsAt,
    } = this.options;

    let text = `every ${intervalAmount > 1 ? intervalAmount + ' ' : ''}${interval}${intervalAmount > 1 ? 's' : ''}`;

    if (daysOfWeekOnly && daysOfWeekOnly.length > 0) {
      text += ` on ${this._listToHumanReadable(daysOfWeekOnly, 'day')}`;
    }

    if (hoursOfDayOnly && hoursOfDayOnly.length > 0) {
      text += ` at ${this._listToHumanReadable(hoursOfDayOnly, 'hour')}`;
    }

    if (daysOfMonthOnly && daysOfMonthOnly.length > 0) {
      text += ` on the ${this._listToHumanReadable(daysOfMonthOnly, 'dayOfMonth')} of the month`;
    }

    if (count) {
      text += ` for ${count} times`;
    }

    if (endsAt) {
      text += ` until ${endsAt.toDateString()}`;
    }

    text += ` starting ${startsAt.toLocaleDateString()}`;

    return text;
  }

  toStringPattern() {
    const { startsAt, endsAt, ...options } = this.options;

    return JSON.stringify({
      ...options,
      startsAt: toLocalTime(startsAt),
      endsAt: endsAt ? toLocalTime(endsAt) : undefined,
    });
  }

  static fromStringPattern(value: string) {
    const { startsAt, endsAt, ...options } = JSON.parse(value);

    return new Recurrence({
      ...options,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : undefined,
    });
  }

  getNextDate(date: Date): Date | null {
    const { startsAt, maxIterations, count } = this.options;

    let iterations = 0;
    let currentDate = date;

    if (currentDate < startsAt) {
      currentDate = startsAt;
    }

    if (count) {
      let occurrences = 0;
      let tempDate = startsAt;

      while (tempDate <= date) {
        if (this._matchesOptions(tempDate) && this._isWithinDateRange(tempDate)) {
          occurrences++;
          if (occurrences >= count) {
            return null;
          }
        }

        tempDate = this._incrementDate(tempDate);
      }
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      currentDate = this._incrementDate(currentDate);
      if (this._matchesOptions(currentDate) && this._isWithinDateRange(currentDate)) {
        return currentDate;
      }

      iterations++;
      if (iterations > maxIterations) {
        throw new Error('Too many iterations. Infinite loop detected.');
      }
    }
  }

  getNextDates(date: Date, maxCount: number): Date[] {
    const { startsAt, endsAt, maxIterations, count } = this.options;

    if (maxCount < 1) {
      return [];
    }

    const dates: Date[] = [];

    maxCount = count ? Math.min(maxCount, count) : maxCount;
    let iterations = 0;
    let currentDate = date < startsAt ? startsAt : date;
    while (dates.length < maxCount) {
      currentDate = this._incrementDate(currentDate);
      if (this._matchesOptions(currentDate) && this._isWithinDateRange(currentDate)) {
        dates.push(currentDate);
      }

      if (endsAt && currentDate > endsAt) {
        break;
      }

      iterations++;
      if (iterations > maxIterations) {
        throw new Error('Too many iterations. Infinite loop detected.');
      }
    }

    return dates;
  }

  getDatesBetween(startDate: Date, endDate: Date): Date[] {
    const { startsAt, endsAt, maxIterations, count } = this.options;

    const dates: Date[] = [];

    const maxCount = count ? Math.min(count, Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;
    let iterations = 0;
    let currentDate = this._incrementDate(startsAt);

    while (currentDate <= endDate) {
      if (this._matchesOptions(currentDate) && currentDate >= startDate) {
        break;
      }

      currentDate = this._incrementDate(currentDate);
    }

    while (dates.length < maxCount && currentDate <= endDate) {
      if (this._matchesOptions(currentDate)) {
        dates.push(currentDate);
      }

      currentDate = this._incrementDate(currentDate);

      if (endsAt && currentDate > endsAt) {
        break;
      }

      iterations++;
      if (iterations > maxIterations) {
        throw new Error('Too many iterations. Infinite loop detected.');
      }
    }

    return dates;
  }

  // Private
  _validateOptions(options: RecurrenceOptions) {
    if (!options.startsAt) {
      throw new Error('Start date is required');
    }

    const optionsStartsAt = options.startsAt;
    if (isNaN(optionsStartsAt.getTime())) {
      throw new Error('Invalid start date');
    }

    if (!Object.values(RecurrenceIntervalEnum).includes(options.interval)) {
      throw new Error('Invalid interval');
    }

    if (options.intervalAmount < 1) {
      throw new Error('Interval amount must be greater than 0');
    } else if (typeof options.count !== 'undefined' && options.count < 1) {
      throw new Error('Count must be greater than 0');
    }

    if (options.endsAt && options.startsAt > options.endsAt) {
      throw new Error('Start date must be before end date');
    }

    if (options.maxIterations) {
      if (options.maxIterations < 0) {
        throw new Error('Max iterations must be a number greater than 0');
      } else if (options.maxIterations > Number.MAX_SAFE_INTEGER) {
        throw new Error('Max iterations must be a number less than Number.MAX_SAFE_INTEGER');
      }
    }
  }

  private _incrementDate(date: Date): Date {
    const { interval, intervalAmount } = this.options;

    let nextDate = new Date(date.getTime());

    switch (interval) {
      case RecurrenceIntervalEnum.HOUR:
        nextDate = add(nextDate, { hours: intervalAmount });
        break;
      case RecurrenceIntervalEnum.DAY:
        nextDate = add(nextDate, { days: intervalAmount });
        break;
      case RecurrenceIntervalEnum.WEEK:
        nextDate = add(nextDate, { weeks: intervalAmount });
        break;
      case RecurrenceIntervalEnum.MONTH:
        nextDate = add(nextDate, { months: intervalAmount });
        break;
      case RecurrenceIntervalEnum.YEAR:
        nextDate = add(nextDate, { years: intervalAmount });
        break;
      default:
        throw new Error('Invalid interval type');
    }

    nextDate = this._moveToNextValidDate(nextDate);

    return nextDate;
  }

  private _moveToNextValidDate(date: Date) {
    const { hoursOfDayOnly } = this.options;

    date = this._moveToNextValidDayOfWeek(date);

    if (hoursOfDayOnly && hoursOfDayOnly.length > 0) {
      while (!hoursOfDayOnly.includes(date.getHours())) {
        date = add(date, { hours: 1 });
        date = this._moveToNextValidDayOfWeek(date);
      }
    }

    return date;
  }

  private _moveToNextValidDayOfWeek(date: Date) {
    const { daysOfWeekOnly } = this.options;

    if (!daysOfWeekOnly || daysOfWeekOnly.length === 0) {
      return date;
    }

    let dayIncrement = 0;
    while (!daysOfWeekOnly.includes((date.getDay() + dayIncrement) % 7)) {
      dayIncrement++;
    }

    return add(date, { days: dayIncrement });
  }

  private _isWithinDateRange(date: Date): boolean {
    const { startsAt, endsAt } = this.options;

    if (date <= startsAt) {
      return false;
    }

    if (endsAt && date > endsAt) {
      return false;
    }

    return true;
  }

  private _matchesOptions(date: Date): boolean {
    const { hoursOfDayOnly, daysOfWeekOnly, daysOfMonthOnly } = this.options;

    if (hoursOfDayOnly && hoursOfDayOnly.length > 0 && !hoursOfDayOnly.includes(date.getHours())) {
      return false;
    }

    if (
      daysOfWeekOnly &&
      daysOfWeekOnly.length > 0 &&
      !daysOfWeekOnly.includes(date.getDay() as RecurrenceDayOfWeekEnum)
    ) {
      return false;
    }

    if (
      daysOfMonthOnly &&
      daysOfMonthOnly.length > 0 &&
      !daysOfMonthOnly.includes(date.getDate())
    ) {
      return false;
    }

    return true;
  }

  private _listToHumanReadable(
    list: number[] | RecurrenceDayOfWeekEnum[],
    type: 'day' | 'hour' | 'dayOfMonth'
  ): string {
    if (list.length === 0) {
      return '';
    }

    const toStringMap = {
      day: (item: RecurrenceDayOfWeekEnum) => DAY_OF_WEEK_MAP[item],
      hour: (item: number) => `${item}:00`,
      dayOfMonth: (item: number) =>
        `${item}${item === 1 ? 'st' : item === 2 ? 'nd' : item === 3 ? 'rd' : 'th'}`,
    };

    return list.map((item) => toStringMap[type](item)).join(', ');
  }
}
