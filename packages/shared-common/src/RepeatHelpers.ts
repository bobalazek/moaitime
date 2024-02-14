import type { Options } from 'rrule';

import { Frequency, RRule } from 'rrule';

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

  return new RRule(newOptions, true);
};

export const getRuleFromString = (ruleString: string) => {
  return RRule.fromString(ruleString);
};

export const convertRuleToString = (rule: RRule) => {
  return RRule.optionsToString(rule.options);
};

export const getRuleIterationAfter = (ruleOrRuleString: RRule | string, date: Date) => {
  const rule =
    typeof ruleOrRuleString === 'string' ? getRuleFromString(ruleOrRuleString) : ruleOrRuleString;

  return rule.after(date, true);
};

export const getRuleIterationBefore = (ruleOrRuleString: RRule, date: Date) => {
  const rule =
    typeof ruleOrRuleString === 'string' ? getRuleFromString(ruleOrRuleString) : ruleOrRuleString;

  return rule.before(date, true);
};

export const getRuleIterationsBetween = (
  ruleOrRuleString: RRule | string,
  startDate: Date,
  endDate: Date
) => {
  const rule =
    typeof ruleOrRuleString === 'string' ? getRuleFromString(ruleOrRuleString) : ruleOrRuleString;

  return rule.between(startDate, endDate, true);
};

export { Options as RuleOptions, Frequency as RuleFrequency };
