import { addDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { XIcon } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';

import {
  addDateTimezoneToItself,
  convertRuleToString,
  createRule,
  getRuleFromString,
  removeDateTimezoneFromItself,
  RuleFrequency,
  RuleOptions,
  updateRule,
} from '@moaitime/shared-common';
import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  ToggleGroup,
  ToggleGroupItem,
} from '@moaitime/web-ui';

import {
  convertIsoStringToObject,
  convertObjectToIsoString,
} from '../../../calendar/utils/CalendarHelpers';
import DateSelector from './DateSelector';

const DEFAULT_OCCURENCES = 5;
const MAX_DATES_TO_SHOW = 5;

export enum RepeatSelectorEndsEnum {
  NEVER = 'never',
  UNTIL_DATE = 'until_date',
  COUNT = 'count',
}

export type RepeatSelectorProps = {
  value?: string;
  startsAt: Date;
  onChangeValue: (value?: string, endsAt?: Date) => void;
  disableTime?: boolean;
};

export function RepeatSelector({
  value,
  startsAt,
  onChangeValue,
  disableTime,
}: RepeatSelectorProps) {
  const [open, setOpen] = useState(false);
  const [rule, setRule] = useState(
    createRule({
      freq: RuleFrequency.DAILY,
      interval: 1,
    })
  );
  const [endsType, setEndsType] = useState<RepeatSelectorEndsEnum>(RepeatSelectorEndsEnum.NEVER);

  const ruleString = rule.toText();
  const ruleDates = rule.all((_, index) => index < MAX_DATES_TO_SHOW);

  useEffect(() => {
    const newRule = value
      ? getRuleFromString(value)
      : updateRule(
          rule,
          {
            dtstart: zonedTimeToUtc(startsAt, 'UTC'),
          },
          disableTime
        );

    setRule(newRule);

    // Make sure ends at is always first, so we set the correct endsType
    if (newRule.options.until) {
      setEndsType(RepeatSelectorEndsEnum.UNTIL_DATE);
    } else if (newRule.options.count) {
      setEndsType(RepeatSelectorEndsEnum.COUNT);
    }

    // We do not want to update the rule when the value changes, because it constantly just overides the old value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, startsAt, disableTime, setEndsType]);

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onChangeValue(); // basically means I provided 3 "undefined" values

    setOpen(false);
  };

  const onSaveButtonSave = (event: MouseEvent) => {
    event.preventDefault();

    const ruleValue = convertRuleToString(rule) ?? undefined;

    onChangeValue(ruleValue, rule.options.until ?? undefined);

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between text-xs"
          data-test="repeat-selector--trigger-button"
        >
          {!value && <span className="text-muted-foreground italic">Does not repeat</span>}
          {value && (
            <>
              <span className="flex text-left">Repeats {getRuleFromString(value).toText()}</span>
              <span className="text-muted-foreground rounded-full p-1" onClick={onClearButtonClick}>
                <XIcon />
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="flex w-[380px] flex-col gap-2 p-2"
        data-test="repeat-selector"
      >
        <h3 className="text-xl font-bold">Repeat</h3>
        <div className="text-muted-foreground">
          <div className="flex flex-row items-center gap-2">
            <span>Repeat every</span>
            <Input
              type="number"
              value={rule.options.interval}
              onChange={(event) => {
                setRule((current) => {
                  return updateRule(
                    current,
                    {
                      interval: parseInt(event.target.value),
                    },
                    disableTime
                  );
                });
              }}
              className="w-20"
              min={1}
              max={999}
            />
            <select
              value={rule.options.freq}
              onChange={(event) => {
                setRule((current) => {
                  return updateRule(
                    current,
                    {
                      freq: parseInt(event.target.value),
                    },
                    disableTime
                  );
                });
              }}
              className="rounded-md border border-gray-300 bg-transparent p-2.5"
            >
              <option value={RuleFrequency.DAILY}>days</option>
              <option value={RuleFrequency.WEEKLY}>weeks</option>
              <option value={RuleFrequency.MONTHLY}>months</option>
              <option value={RuleFrequency.YEARLY}>years</option>
            </select>
          </div>
        </div>
        {rule.options.freq === RuleFrequency.WEEKLY && (
          <div>
            <h4 className="text-muted-foreground">Repeat on</h4>
            <ToggleGroup
              type="multiple"
              value={rule.options.byweekday?.map((day) => day.toString()) ?? []}
              onValueChange={(value) => {
                setRule((current) => {
                  return updateRule(
                    current,
                    {
                      byweekday: value?.map((day) => parseInt(day)) ?? null,
                    },
                    disableTime
                  );
                });
              }}
            >
              {/* For some strange reason it's 0 for Monday, where as usually that's Sunday */}
              <ToggleGroupItem value="0" className="flex-grow">
                Mo
              </ToggleGroupItem>
              <ToggleGroupItem value="1" className="flex-grow">
                Tu
              </ToggleGroupItem>
              <ToggleGroupItem value="2" className="flex-grow">
                We
              </ToggleGroupItem>
              <ToggleGroupItem value="3" className="flex-grow">
                Th
              </ToggleGroupItem>
              <ToggleGroupItem value="4" className="flex-grow">
                Fr
              </ToggleGroupItem>
              <ToggleGroupItem value="5" className="flex-grow">
                Sa
              </ToggleGroupItem>
              <ToggleGroupItem value="6" className="flex-grow">
                Su
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
        <div>
          <h4 className="text-muted-foreground mb-1">Ends</h4>
          <RadioGroup
            value={endsType}
            onValueChange={(value) => {
              setEndsType(value as RepeatSelectorEndsEnum);

              const options: Partial<RuleOptions> = {
                until:
                  value === RepeatSelectorEndsEnum.UNTIL_DATE
                    ? rule.options.until ?? addDays(new Date(), 7)
                    : null,
                count:
                  value === RepeatSelectorEndsEnum.COUNT
                    ? rule.options.count ?? DEFAULT_OCCURENCES
                    : null,
              };

              setRule((current) => {
                return updateRule(current, options, disableTime);
              });
            }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center">
              <div className="flex w-32 gap-2">
                <RadioGroupItem id="repeat-ends-type-never" value={RepeatSelectorEndsEnum.NEVER} />
                <Label htmlFor="repeat-ends-type-never">Never</Label>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex min-w-[80px] flex-grow gap-2">
                <RadioGroupItem
                  id="repeat-ends-type-until-date"
                  value={RepeatSelectorEndsEnum.UNTIL_DATE}
                />
                <Label htmlFor="repeat-ends-type-until-date">Until</Label>
              </div>
              <DateSelector
                data={convertIsoStringToObject(
                  rule.options.until
                    ? removeDateTimezoneFromItself(rule.options.until).toISOString()
                    : addDays(new Date(), 7).toISOString(),
                  !disableTime,
                  undefined
                )}
                onSaveData={(saveData) => {
                  const result = convertObjectToIsoString(saveData);

                  setRule((current) => {
                    const dateEnd = addDateTimezoneToItself(
                      result?.iso ? new Date(result?.iso) : new Date()
                    );

                    return updateRule(
                      current,
                      {
                        until: dateEnd,
                        count: null,
                      },
                      disableTime
                    );
                  });
                }}
                disabled={endsType !== RepeatSelectorEndsEnum.UNTIL_DATE}
                includeTime={false}
                disableTimeZone={true}
                disableClear={true}
              />
            </div>
            <div className="flex items-center">
              <div className="flex min-w-[80px] gap-2">
                <RadioGroupItem
                  id="repeat-ends-type-after-count"
                  value={RepeatSelectorEndsEnum.COUNT}
                />
                <Label htmlFor="repeat-ends-type-after-count">After</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={rule.options.count ?? DEFAULT_OCCURENCES}
                  onChange={(event) => {
                    setRule((current) => {
                      return updateRule(
                        current,
                        {
                          count: parseInt(event.target.value),
                          until: null,
                        },
                        disableTime
                      );
                    });
                  }}
                  disabled={endsType !== RepeatSelectorEndsEnum.COUNT}
                  className="w-20"
                  min={1}
                  max={999}
                />
                <span>occurences</span>
              </div>
            </div>
          </RadioGroup>
        </div>
        {ruleString && (
          <div>
            <h4 className="text-muted-foreground mt-2">
              Dates for <b className="text-sm">{ruleString}</b>:
            </h4>
            {ruleDates.length === 0 && (
              <div className="text-muted-foreground text-xs">
                No dates for the specified parameters
              </div>
            )}
            {ruleDates.length > 0 && (
              <ul className="list-disc pl-5 text-xs leading-5">
                {ruleDates.map((date) => {
                  const finalDate = removeDateTimezoneFromItself(date);
                  return (
                    <li key={date.toISOString()}>
                      {disableTime ? finalDate.toLocaleDateString() : finalDate.toLocaleString()}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        <div>
          <Button className="w-full" onClick={onSaveButtonSave}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
