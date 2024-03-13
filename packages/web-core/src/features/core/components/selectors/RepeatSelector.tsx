import { addDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { XIcon } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';

import {
  Recurrence,
  RecurrenceDayOfWeekEnum,
  RecurrenceIntervalEnum,
  RecurrenceOptions,
} from '@moaitime/recurrence';
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

import { useAuthUserSetting } from '../../../auth/state/authStore';
import {
  convertIsoStringToObject,
  convertObjectToIsoString,
} from '../../../calendar/utils/CalendarHelpers';
import DateSelector from './DateSelector';

const DEFAULT_OCCURENCES = 5;
const MAX_DATES_TO_SHOW = 5;

enum RepeatSelectorEndsEnum {
  NEVER = 'never',
  UNTIL_DATE = 'until_date',
  COUNT = 'count',
}

export type RepeatSelectorProps = {
  startsAt: Date;
  value?: string;
  onChangeValue: (value?: string, endsAt?: Date) => void;
  disableTime?: boolean;
};

export function RepeatSelector({
  value,
  startsAt,
  onChangeValue,
  disableTime,
}: RepeatSelectorProps) {
  const generalStartDayOfWeek = useAuthUserSetting('generalStartDayOfWeek', 0);
  const [open, setOpen] = useState(false);
  const [recurrence, setRecurrence] = useState(
    new Recurrence({
      startsAt: zonedTimeToUtc(startsAt, 'UTC'),
      interval: RecurrenceIntervalEnum.DAY,
      intervalAmount: 1,
      startOfWeek: generalStartDayOfWeek as RecurrenceDayOfWeekEnum,
    })
  );
  const [endsType, setEndsType] = useState<RepeatSelectorEndsEnum>(RepeatSelectorEndsEnum.NEVER);

  const recurrenceOptions = recurrence.getOptions();
  const recurrenceString = recurrence.toHumanText();
  const recurrenceDates = recurrence.getNextDates(startsAt, MAX_DATES_TO_SHOW);

  useEffect(() => {
    const newRecurrence = value
      ? Recurrence.fromStringPattern(value)
      : recurrence.updateOptions({
          startsAt: zonedTimeToUtc(startsAt, 'UTC'),
        });

    setRecurrence(newRecurrence);

    const newRecurrenceOptions = newRecurrence.getOptions();

    // Make sure ends at is always first, so we set the correct endsType
    if (newRecurrenceOptions.endsAt) {
      setEndsType(RepeatSelectorEndsEnum.UNTIL_DATE);
    } else if (newRecurrenceOptions.count) {
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

    const recurrenceValue = recurrence.toStringPattern();

    onChangeValue(recurrenceValue, recurrence.endsAt);

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
              <span className="flex text-left">
                Repeats {Recurrence.fromStringPattern(value).toHumanText()}
              </span>
              <span className="text-muted-foreground rounded-full p-1" onClick={onClearButtonClick}>
                <XIcon />
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="flex w-[380px] flex-col gap-2 px-4 py-2"
        data-test="repeat-selector"
      >
        <h3 className="text-xl font-bold">Repeat</h3>
        <div className="text-muted-foreground">
          <div className="flex flex-row items-center gap-2">
            <span>Repeat every</span>
            <Input
              type="number"
              value={recurrenceOptions.intervalAmount}
              onChange={(event) => {
                setRecurrence((current) => {
                  return current.updateOptions({
                    intervalAmount: parseInt(event.target.value),
                  });
                });
              }}
              className="w-20"
              min={1}
              max={999}
            />
            <select
              value={recurrenceOptions.interval}
              onChange={(event) => {
                setRecurrence((current) => {
                  const updateData: Partial<RecurrenceOptions> = {
                    interval: event.target.value as RecurrenceIntervalEnum,
                  };
                  if (recurrenceOptions.interval !== RecurrenceIntervalEnum.WEEK) {
                    updateData.daysOfWeekOnly = undefined;
                  }

                  return current.updateOptions(updateData);
                });
              }}
              className="rounded-md border border-gray-300 bg-transparent p-2.5"
            >
              <option value={RecurrenceIntervalEnum.DAY}>days</option>
              <option value={RecurrenceIntervalEnum.WEEK}>weeks</option>
              <option value={RecurrenceIntervalEnum.MONTH}>months</option>
              <option value={RecurrenceIntervalEnum.YEAR}>years</option>
            </select>
          </div>
        </div>
        {recurrenceOptions.interval === RecurrenceIntervalEnum.WEEK && (
          <div>
            <h4 className="text-muted-foreground">Repeat on</h4>
            <ToggleGroup
              type="multiple"
              value={recurrenceOptions.daysOfWeekOnly?.map((day) => day.toString()) ?? []}
              onValueChange={(value) => {
                setRecurrence((current) => {
                  return current.updateOptions({
                    daysOfWeekOnly: value?.map((weekDay) => parseInt(weekDay)) ?? undefined,
                  });
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

              setRecurrence((current) => {
                return current.updateOptions({
                  endsAt:
                    value === RepeatSelectorEndsEnum.UNTIL_DATE
                      ? recurrenceOptions.endsAt ?? addDays(new Date(), 7)
                      : undefined,
                  count:
                    value === RepeatSelectorEndsEnum.COUNT
                      ? recurrenceOptions.count ?? DEFAULT_OCCURENCES
                      : undefined,
                });
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
                  recurrence.endsAt
                    ? removeDateTimezoneFromItself(recurrence.endsAt).toISOString()
                    : addDays(new Date(), 7).toISOString(),
                  !disableTime,
                  undefined
                )}
                onSaveData={(saveData) => {
                  const result = convertObjectToIsoString(saveData);
                  const endsAt = addDateTimezoneToItself(
                    result?.iso ? new Date(result?.iso) : new Date()
                  );

                  setRecurrence((current) => {
                    return current.updateOptions({
                      endsAt,
                      count: undefined,
                    });
                  });
                }}
                disabled={endsType !== RepeatSelectorEndsEnum.UNTIL_DATE}
                includeTime={!disableTime}
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
                  value={recurrenceOptions.count ?? DEFAULT_OCCURENCES}
                  onChange={(event) => {
                    setRecurrence((current) => {
                      return current.updateOptions({
                        count: parseInt(event.target.value),
                        endsAt: undefined,
                      });
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
        {recurrenceString && (
          <div>
            <h4 className="text-muted-foreground mt-2">
              Dates for <b className="text-sm">{recurrenceString}</b>:
            </h4>
            {recurrenceDates.length === 0 && (
              <div className="text-muted-foreground text-xs">
                No dates for the specified parameters
              </div>
            )}
            {recurrenceDates.length > 0 && (
              <ul className="list-disc pl-5 text-xs leading-5">
                {recurrenceDates.map((date) => {
                  return (
                    <li key={date.toISOString()}>
                      {disableTime ? date.toLocaleDateString() : date.toLocaleString()}
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
