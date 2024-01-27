import type { Options } from 'rrule';

import { XIcon } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';
import { Frequency, RRule } from 'rrule';

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from '@moaitime/web-ui';

import {
  convertIsoStringToObject,
  convertObjectToIsoString,
} from '../../../calendar/utils/CalendarHelpers';
import DateSelector from './DateSelector';

const DEFAULT_RRULE_OPTIONS: Partial<Options> = {
  freq: Frequency.DAILY,
  interval: 1,
  bysecond: [0],
};

export type RepeatSelectorProps = {
  value?: string;
  onChangeValue: (value?: string, startsAt?: Date, endsAt?: Date) => void;
};

export function RepeatSelector({ value, onChangeValue }: RepeatSelectorProps) {
  const [open, setOpen] = useState(false);
  const [rule, setRule] = useState(new RRule(DEFAULT_RRULE_OPTIONS));

  const ruleString = rule.toText();

  useEffect(() => {
    setRule(value ? RRule.fromString(value) : new RRule(DEFAULT_RRULE_OPTIONS));
  }, [value]);

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onChangeValue(undefined);

    setOpen(false);
  };

  const onSaveButtonSave = (event: MouseEvent) => {
    event.preventDefault();

    onChangeValue(RRule.optionsToString(rule.options) ?? undefined);

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
        <div>
          <h4 className="text-muted-foreground">Start Time</h4>
          <DateSelector
            data={convertIsoStringToObject(rule.options.dtstart.toISOString(), true, undefined)}
            onSaveData={(saveData) => {
              const result = convertObjectToIsoString(saveData);

              setRule((current) => {
                const dateStart = new Date(result?.iso ?? 'now');
                current.options.dtstart = dateStart;
                current.options.bysecond = [0];
                current.options.byminute = [dateStart.getMinutes()];

                return RRule.fromString(RRule.optionsToString(current.options));
              });
            }}
            includeTime={true}
            disableTimeZone={true}
            disableClear={true}
          />
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
                    {date.toLocaleString()}
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
