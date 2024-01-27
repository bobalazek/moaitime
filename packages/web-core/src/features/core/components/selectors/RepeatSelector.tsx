import type { Options } from 'rrule';

import { XIcon } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';
import { Frequency, RRule } from 'rrule';

import { addDateTimezoneToItself, removeDateTimezoneFromItself } from '@moaitime/shared-common';
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

const getClosestNextHalfHour = () => {
  const now = new Date();
  const minutes = now.getMinutes();

  let halfHour = Math.ceil(minutes / 30) * 30;
  if (30 - minutes <= 5) {
    halfHour += 30;
  }

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), halfHour);
};

const DEFAULT_RRULE_OPTIONS: Partial<Options> = {
  freq: Frequency.DAILY,
  interval: 1,
  bysecond: [0],
};

export type RepeatSelectorEndsType = 'never' | 'until_date' | 'count';

export type RepeatSelectorProps = {
  value?: string;
  onChangeValue: (value?: string, startsAt?: Date, endsAt?: Date) => void;
};

export function RepeatSelector({ value, onChangeValue }: RepeatSelectorProps) {
  const [open, setOpen] = useState(false);
  const [rule, setRule] = useState(
    new RRule({
      ...DEFAULT_RRULE_OPTIONS,
      dtstart: getClosestNextHalfHour(),
    })
  );
  const [endsType, setEndsType] = useState<RepeatSelectorEndsType>('never');
  const [endsAt, setEndsAt] = useState(new Date());
  const [endsAfterCount, setEndsAfterCount] = useState(1);

  const ruleString = rule.toText();

  useEffect(() => {
    setRule(
      value
        ? RRule.fromString(value)
        : new RRule({
            ...DEFAULT_RRULE_OPTIONS,
            dtstart: getClosestNextHalfHour(),
          })
    );
  }, [value]);

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onChangeValue(); // basically means I provided 3 "undefined" values

    setOpen(false);
  };

  const onSaveButtonSave = (event: MouseEvent) => {
    event.preventDefault();

    const startsAtDate = rule.options.dtstart;
    let endsAtDate = undefined;

    if (endsType === 'until_date') {
      endsAtDate = endsAt;
    } else if (endsType === 'count' && endsAfterCount) {
      rule.options.count = endsAfterCount;
    }

    const ruleString = RRule.optionsToString(rule.options) ?? undefined;

    onChangeValue(ruleString, startsAtDate, endsAtDate);

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
              <span className="flex text-left">{RRule.fromString(value).toText()}</span>
              <span className="text-muted-foreground rounded-full p-1" onClick={onClearButtonClick}>
                <XIcon />
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-[380px] flex-col gap-2 p-2" data-test="repeat-selector">
        <h3 className="text-xl font-bold">Repeat</h3>
        <div className="text-muted-foreground">
          <div className="flex flex-row items-center gap-2">
            <span>Repeat every</span>
            <Input
              type="number"
              value={rule.options.interval}
              onChange={(event) => {
                setRule((current) => {
                  current.options.interval = parseInt(event.target.value);
                  return RRule.fromString(RRule.optionsToString(rule.options));
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
                  current.options.freq = parseInt(event.target.value);
                  return RRule.fromString(RRule.optionsToString(current.options));
                });
              }}
              className="rounded-md border border-gray-300 bg-transparent p-2.5"
            >
              <option value={Frequency.DAILY}>days</option>
              <option value={Frequency.WEEKLY}>weeks</option>
              <option value={Frequency.MONTHLY}>months</option>
              <option value={Frequency.YEARLY}>years</option>
            </select>
          </div>
        </div>
        {rule.options.freq === Frequency.WEEKLY && (
          <div>
            <h4 className="text-muted-foreground">Repeat on</h4>
            <ToggleGroup
              type="multiple"
              value={rule.options.byweekday?.map((day) => day.toString()) ?? []}
              onValueChange={(value) => {
                setRule((current) => {
                  current.options.byweekday = value?.map((day) => parseInt(day));
                  return RRule.fromString(RRule.optionsToString(current.options));
                });
              }}
            >
              {/* For some strange reason it's 0 for mMnday, where as usually that's Sunday */}
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
          <h4 className="text-muted-foreground">Starts</h4>
          <DateSelector
            data={convertIsoStringToObject(
              removeDateTimezoneFromItself(rule.options.dtstart).toISOString(),
              true,
              undefined
            )}
            onSaveData={(saveData) => {
              const result = convertObjectToIsoString(saveData);

              setRule((current) => {
                const dateStart = addDateTimezoneToItself(new Date(result?.iso ?? 'now'));

                current.options.dtstart = dateStart;
                current.options.bysecond = [0];
                current.options.byminute = [dateStart.getUTCMinutes()];
                current.options.byhour = [dateStart.getUTCHours()];

                return RRule.fromString(RRule.optionsToString(current.options));
              });
            }}
            includeTime={true}
            disableTimeZone={true}
            disableClear={true}
          />
        </div>
        <div>
          <h4 className="text-muted-foreground mb-1">Ends</h4>
          <RadioGroup
            value={endsType}
            onValueChange={(value) => {
              setEndsType(value as RepeatSelectorEndsType);
            }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center">
              <div className="flex w-32 gap-2">
                <RadioGroupItem id="repeat-ends-type-never" value="never" />
                <Label htmlFor="repeat-ends-type-never">Never</Label>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex min-w-[80px] flex-grow gap-2">
                <RadioGroupItem id="repeat-ends-type-after-date" value="after_date" />
                <Label htmlFor="repeat-ends-type-after-date">Until</Label>
              </div>
              <DateSelector
                data={convertIsoStringToObject(endsAt.toISOString(), false, undefined)}
                onSaveData={(saveData) => {
                  const result = convertObjectToIsoString(saveData);

                  setEndsAt(new Date(result?.iso ?? 'now'));
                }}
                includeTime={false}
                disableTimeZone={true}
                disableClear={true}
              />
            </div>
            <div className="flex items-center">
              <div className="flex min-w-[80px] gap-2">
                <RadioGroupItem id="repeat-ends-type-after-count" value="after_count" />
                <Label htmlFor="repeat-ends-type-after-count">After</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={endsAfterCount}
                  onChange={(event) => {
                    setEndsAfterCount(parseInt(event.target.value));
                  }}
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
            <ul className="list-disc pl-5 text-xs leading-5">
              {rule
                .all((_, index) => index < 5)
                .map((date) => (
                  <li key={date.toISOString()} className="flex-grow">
                    {removeDateTimezoneFromItself(date).toLocaleString()}
                  </li>
                ))}
            </ul>
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
