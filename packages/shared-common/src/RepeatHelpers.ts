import type { Options } from 'rrule';

import { Frequency, RRule } from 'rrule';

export type RuleOptions = Options;

export const RuleFrequency = Frequency;

export const createRule = (options?: Partial<Options>) => {
  return new RRule({ ...options, bysecond: [0] }, true);
};

export const updateRule = (
  original: RRule,
  overrideOptions?: Partial<Options>,
  disableTime?: boolean
) => {
  const newOptions = { ...original.options, ...overrideOptions };
  newOptions.bysecond = !disableTime ? [0] : null;
  newOptions.byminute = !disableTime ? [newOptions.dtstart!.getUTCMinutes()] : null;
  newOptions.byhour = !disableTime ? [newOptions.dtstart!.getUTCHours()] : null;

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
};

export const getRuleFromString = (ruleString: string) => {
  return RRule.fromString(ruleString);
};

export const getRulePattern = (rule: RRule) => {
  return RRule.optionsToString(rule.options);
};

export const getRuleDateNext = (ruleOrRuleString: RRule | string, date: Date) => {
  const rule =
    typeof ruleOrRuleString === 'string' ? getRuleFromString(ruleOrRuleString) : ruleOrRuleString;

  return rule.after(date, true);
};

export const getRuleDatesBetween = (
  ruleOrRuleString: RRule | string,
  startDate: Date,
  endDate: Date
) => {
  const rule =
    typeof ruleOrRuleString === 'string' ? getRuleFromString(ruleOrRuleString) : ruleOrRuleString;

  return rule.between(startDate, endDate, true);
};

export const getRuleDatesAll = (ruleOrRuleString: RRule | string, count: number) => {
  const rule =
    typeof ruleOrRuleString === 'string' ? getRuleFromString(ruleOrRuleString) : ruleOrRuleString;

  return rule.all((_, index) => index < count);
};

export const getRuleToText = (ruleOrRuleString: RRule | string) => {
  const rule =
    typeof ruleOrRuleString === 'string' ? getRuleFromString(ruleOrRuleString) : ruleOrRuleString;

  return rule.toText();
};
