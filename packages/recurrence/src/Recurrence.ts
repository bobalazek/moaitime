import { add, isBefore, isWithinInterval } from 'date-fns';

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
};

export class Recurrence {
  private _options: RecurrenceOptions;
  private _maxIterations = 5000;

  constructor(options: RecurrenceOptions) {
    this._validateOptions(options);

    this._options = options;
  }

  // Getters
  get options() {
    return this._options;
  }

  updateOptions(options: Partial<RecurrenceOptions>) {
    const newOptions = {
      ...this._options,
      ...options,
    };

    this._validateOptions(newOptions);

    this._options = newOptions;

    return new Recurrence(newOptions);
  }

  toHumanText() {
    const { interval, intervalAmount, hoursOfDayOnly, daysOfWeekOnly, daysOfMonthOnly } =
      this._options;

    let text = `Every ${intervalAmount > 1 ? intervalAmount + ' ' : ''}${interval}${intervalAmount > 1 ? 's' : ''}`;

    if (daysOfWeekOnly && daysOfWeekOnly.length > 0) {
      text += ` on ${this._listToHumanReadable(daysOfWeekOnly, 'day')}`;
    }

    if (hoursOfDayOnly && hoursOfDayOnly.length > 0) {
      text += ` at ${this._listToHumanReadable(hoursOfDayOnly, 'hour')}`;
    }

    if (daysOfMonthOnly && daysOfMonthOnly.length > 0) {
      text += ` on the ${this._listToHumanReadable(daysOfMonthOnly, 'dayOfMonth')} of the month`;
    }

    if (this.options.endsAt) {
      const endsAt = new Date(this.options.endsAt);
      text += ` until ${endsAt.toDateString()}`;
    }

    return text;
  }

  toStringPattern() {
    const { startsAt, endsAt, ...options } = this._options;

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
    let iterations = 0;
    let currentDate = new Date(date);

    if (currentDate < this.options.startsAt) {
      currentDate = new Date(this.options.startsAt);
    }

    if (this._options.count) {
      let occurrences = 0;
      let tempDate = new Date(this.options.startsAt);

      while (tempDate <= date) {
        if (this._matchesOptions(tempDate) && this._isWithinDateRange(tempDate)) {
          occurrences++;
          if (occurrences >= this._options.count) {
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
      if (iterations > this._maxIterations) {
        throw new Error('Too many iterations. Infinite loop detected.');
      }
    }
  }

  getNextDates(date: Date, count: number): Date[] {
    const dates: Date[] = [];

    const startsAt = new Date(this._options.startsAt);
    const endsAt = this._options.endsAt ? new Date(this._options.endsAt) : null;

    const maxCount = this._options.count ? Math.min(count, this._options.count) : count;
    let iterations = 0;
    let currentDate = date < startsAt ? startsAt : new Date(date);
    while (dates.length < maxCount) {
      currentDate = this._incrementDate(currentDate);
      if (this._matchesOptions(currentDate) && this._isWithinDateRange(currentDate)) {
        dates.push(currentDate);
      }

      if (endsAt && currentDate > endsAt) {
        break;
      }

      iterations++;
      if (iterations > this._maxIterations) {
        throw new Error('Too many iterations. Infinite loop detected.');
      }
    }

    return dates;
  }

  getDatesBetween(startDate: Date, endDate: Date): Date[] {
    const startsAt = new Date(this._options.startsAt);
    const endsAt = this._options.endsAt ? new Date(this._options.endsAt) : null;
    const adjustedStartsAt = startDate < startsAt ? startsAt : startDate;
    const adjustedEndsAt = endsAt && endDate > endsAt ? endsAt : endDate;

    const dates: Date[] = [];
    let iterations = 0;
    let occurrences = 0;
    let currentDate = new Date(adjustedStartsAt);

    while (isBefore(currentDate, adjustedEndsAt)) {
      if (
        this._matchesOptions(currentDate) &&
        isWithinInterval(currentDate, { start: adjustedStartsAt, end: adjustedEndsAt })
      ) {
        dates.push(currentDate);
        occurrences++;

        if (this._options.count !== undefined && occurrences >= this._options.count) {
          break;
        }
      }

      currentDate = this._incrementDate(currentDate);
      iterations++;
      if (iterations > this._maxIterations) {
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

    const optionsStartsAt = new Date(options.startsAt);
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
  }

  private _incrementDate(date: Date): Date {
    const { interval, intervalAmount } = this._options;
    switch (interval) {
      case RecurrenceIntervalEnum.HOUR:
        return add(date, { hours: intervalAmount });
      case RecurrenceIntervalEnum.DAY:
        return add(date, { days: intervalAmount });
      case RecurrenceIntervalEnum.WEEK:
        return add(date, { weeks: intervalAmount });
      case RecurrenceIntervalEnum.MONTH:
        return add(date, { months: intervalAmount });
      case RecurrenceIntervalEnum.YEAR:
        return add(date, { years: intervalAmount });
      default:
        throw new Error('Invalid interval type');
    }
  }

  private _isWithinDateRange(date: Date): boolean {
    const startsAt = new Date(this._options.startsAt);
    const endsAt = this._options.endsAt ? new Date(this._options.endsAt) : null;

    if (date <= startsAt) {
      return false;
    }

    if (endsAt && date > endsAt) {
      return false;
    }

    return true;
  }

  private _matchesOptions(date: Date): boolean {
    const { hoursOfDayOnly, daysOfWeekOnly, daysOfMonthOnly } = this._options;

    if (hoursOfDayOnly && !hoursOfDayOnly.includes(date.getHours())) {
      return false;
    }

    if (daysOfWeekOnly && !daysOfWeekOnly.includes(date.getDay() as RecurrenceDayOfWeekEnum)) {
      return false;
    }

    if (daysOfMonthOnly && !daysOfMonthOnly.includes(date.getDate())) {
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
      day: (item: RecurrenceDayOfWeekEnum) => this._dayOfWeekToString(item),
      hour: (item: number) => `${item}:00`,
      dayOfMonth: (item: number) =>
        `${item}${item === 1 ? 'st' : item === 2 ? 'nd' : item === 3 ? 'rd' : 'th'}`,
    };

    const converter = toStringMap[type];

    return list.map((item) => converter(item)).join(', ');
  }

  private _dayOfWeekToString(day: RecurrenceDayOfWeekEnum): string {
    const dayOfWeekMap = {
      [RecurrenceDayOfWeekEnum.SUNDAY]: 'Sunday',
      [RecurrenceDayOfWeekEnum.MONDAY]: 'Monday',
      [RecurrenceDayOfWeekEnum.TUESDAY]: 'Tuesday',
      [RecurrenceDayOfWeekEnum.WEDNESDAY]: 'Wednesday',
      [RecurrenceDayOfWeekEnum.THURSDAY]: 'Thursday',
      [RecurrenceDayOfWeekEnum.FRIDAY]: 'Friday',
      [RecurrenceDayOfWeekEnum.SATURDAY]: 'Saturday',
    };
    return dayOfWeekMap[day];
  }
}
