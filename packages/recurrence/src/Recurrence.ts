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
      ...this.options,
      ...options,
    };

    this._validateOptions(newOptions);

    this._options = newOptions;

    return new Recurrence(newOptions);
  }

  toHumanText() {
    const { interval, intervalAmount, hoursOfDayOnly, daysOfWeekOnly, daysOfMonthOnly } =
      this.options;

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

    if (this.options.count) {
      text += ` for ${this.options.count} times`;
    }

    if (this.options.endsAt) {
      text += ` until ${this.options.endsAt.toDateString()}`;
    }

    text += ` starting ${this.options.startsAt.toLocaleDateString()}`;

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
    let iterations = 0;
    let currentDate = date;

    if (currentDate < this.options.startsAt) {
      currentDate = this.options.startsAt;
    }

    if (this.options.count) {
      let occurrences = 0;
      let tempDate = this.options.startsAt;

      while (tempDate <= date) {
        if (this._matchesOptions(tempDate) && this._isWithinDateRange(tempDate)) {
          occurrences++;
          if (occurrences >= this.options.count) {
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
    if (count < 1) {
      return [];
    }

    const dates: Date[] = [];

    const maxCount = this.options.count ? Math.min(count, this.options.count) : count;
    let iterations = 0;
    let currentDate = date < this.options.startsAt ? this.options.startsAt : date;
    while (dates.length < maxCount) {
      currentDate = this._incrementDate(currentDate);
      if (this._matchesOptions(currentDate) && this._isWithinDateRange(currentDate)) {
        dates.push(currentDate);
      }

      if (this.options.endsAt && currentDate > this.options.endsAt) {
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
    let currentDate = startDate < this.options.startsAt ? this.options.startsAt : startDate;
    const adjustedEndsAt =
      this.options.endsAt && endDate > this.options.endsAt ? this.options.endsAt : endDate;

    const dates: Date[] = [];
    let iterations = 0;
    let occurrences = 0;

    if (this.options.count) {
      let tempDate = this.options.startsAt;
      while (tempDate < currentDate && occurrences < this.options.count) {
        if (this._matchesOptions(tempDate) && this._isWithinDateRange(tempDate)) {
          occurrences++;
        }

        tempDate = this._incrementDate(tempDate);
      }
    }

    while (
      currentDate <= adjustedEndsAt &&
      (this.options.count === undefined || occurrences < this.options.count)
    ) {
      if (this._matchesOptions(currentDate) && this._isWithinDateRange(currentDate)) {
        dates.push(currentDate);
        occurrences++;
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
  }

  private _incrementDate(date: Date): Date {
    const { interval, intervalAmount, hoursOfDayOnly } = this.options;

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

    nextDate = this._moveToNextValidDayOfWeek(nextDate);

    if (hoursOfDayOnly && hoursOfDayOnly.length > 0) {
      while (!hoursOfDayOnly.includes(nextDate.getHours())) {
        nextDate = add(nextDate, { hours: 1 });
        nextDate = this._moveToNextValidDayOfWeek(nextDate);
      }
    }

    return nextDate;
  }

  private _moveToNextValidDayOfWeek(date: Date) {
    const { daysOfWeekOnly } = this.options;

    if (!daysOfWeekOnly) {
      return date;
    }

    let dayIncrement = 0;
    while (!daysOfWeekOnly.includes((date.getDay() + dayIncrement) % 7)) {
      dayIncrement++;
    }

    return add(date, { days: dayIncrement });
  }

  private _isWithinDateRange(date: Date): boolean {
    if (date <= this.options.startsAt) {
      return false;
    }

    if (this.options.endsAt && date > this.options.endsAt) {
      return false;
    }

    return true;
  }

  private _matchesOptions(date: Date): boolean {
    const { hoursOfDayOnly, daysOfWeekOnly, daysOfMonthOnly } = this.options;

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
