import type { Options } from 'rrule';

import { Frequency, RRule } from 'rrule';

export const createRule = (options?: Partial<Options>) => {
  return new RRule({ ...options, bysecond: [0] });
};

export const updateRule = (
  original: RRule,
  overrideOptions?: Partial<Options>,
  disableTime?: boolean
) => {
  const clone = original.clone();

  if (overrideOptions) {
    Object.assign(clone.options, overrideOptions);
  }

  clone.options.bysecond = [0];
  clone.options.byminute = !disableTime ? [clone.options.dtstart.getUTCMinutes()] : [0];
  clone.options.byhour = !disableTime ? [clone.options.dtstart.getUTCHours()] : [0];

  return clone;
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
