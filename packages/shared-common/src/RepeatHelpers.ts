import type { Options } from 'rrule';

import { Frequency, RRule } from 'rrule';

export const createRule = (options?: Partial<Options>) => {
  return new RRule(options);
};

export const cloneRule = (
  original: RRule,
  overwriteOptions?: Partial<Options>,
  disableTime?: boolean
) => {
  const clone = original.clone();

  if (overwriteOptions) {
    Object.assign(clone.options, overwriteOptions);
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

export { Options as RuleOptions, Frequency as RuleFrequency };
