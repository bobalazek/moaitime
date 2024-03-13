import type { Options } from 'rrule';

import { Frequency, RRule } from 'rrule';

export type RecurrenceParserOptions = Options;

export const RecurrenceParserFrequency = Frequency;

export class RecurrenceParser {
  createRule(options?: Partial<RecurrenceParserOptions>) {
    return new RRule({ ...options, bysecond: [0] }, true);
  }

  updateRule(
    object: RRule,
    overrideOptions?: Partial<RecurrenceParserOptions>,
    disableTime?: boolean
  ) {
    const newOptions = { ...object.options, ...overrideOptions };
    newOptions.bysecond = !disableTime ? [0] : null;
    newOptions.byminute =
      !disableTime && newOptions.dtstart ? [newOptions.dtstart.getUTCMinutes()] : null;
    newOptions.byhour =
      !disableTime && newOptions.dtstart ? [newOptions.dtstart.getUTCHours()] : null;

    if (!newOptions.count) {
      newOptions.count = 1;
    } else if (newOptions.count) {
      newOptions.count = Math.round(newOptions.count); // Decimals break the library
    }

    if (!newOptions.interval) {
      newOptions.interval = 1;
    } else if (newOptions.interval) {
      newOptions.interval = Math.round(newOptions.interval); // Decimals break the library
    }

    return new RRule(newOptions, true);
  }

  getRuleFromString(string: string) {
    return RRule.fromString(string);
  }

  getRulePattern(object: RRule) {
    return RRule.optionsToString(object.options);
  }

  getRuleDateNext(objectOrString: RRule | string, date: Date) {
    const rule =
      typeof objectOrString === 'string' ? this.getRuleFromString(objectOrString) : objectOrString;

    return rule.after(date, true);
  }

  getRuleDatesBetween(objectOrString: RRule | string, startDate: Date, endDate: Date) {
    const rule =
      typeof objectOrString === 'string' ? this.getRuleFromString(objectOrString) : objectOrString;

    return rule.between(startDate, endDate, true);
  }

  getRuleDatesAll(objectOrString: RRule | string, count: number) {
    const rule =
      typeof objectOrString === 'string' ? this.getRuleFromString(objectOrString) : objectOrString;

    return rule.all((_, index) => index < count);
  }

  getRuleToText(objectOrString: RRule | string) {
    const rule =
      typeof objectOrString === 'string' ? this.getRuleFromString(objectOrString) : objectOrString;

    return rule.toText();
  }
}

export const recurrenceParser = new RecurrenceParser();
