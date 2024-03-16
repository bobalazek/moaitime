import { format, startOfDay } from 'date-fns';
import { CalendarIcon, RepeatIcon, XIcon } from 'lucide-react';
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import { Recurrence } from '@moaitime/recurrence';
import { isValidTime } from '@moaitime/shared-common';
import {
  Button,
  Calendar,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { ErrorBoundary } from '../ErrorBoundary';
import { RepeatSelector } from './RepeatSelector';
import TimeSelector from './TimeSelector';
import TimezoneSelector from './TimezoneSelector';

// TODO: somehow merge with date selector, but issue is, that we then have a circular dependency with RepeatSelector

export type DueDateSelectorData = {
  date: string | null;
  dateTime: string | null;
  dateTimeZone: string | null;
  repeatPattern: string | null;
  repeatEndsAt: string | null;
};

export type DueDateSelectorProps = {
  data: DueDateSelectorData;
  onSaveData: (value: DueDateSelectorData) => void;
  disabled?: boolean;
  includeTime?: boolean;
  includeRepeat?: boolean;
  disableClear?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  disableTimeZone?: boolean;
  isTimezoneReadonly?: boolean;
  timezonePlaceholderText?: string;
};

export const DateSelectorText = ({ data }: { data: DueDateSelectorData }) => {
  let timezonedDate: string | null = null;
  if (data.date && data.dateTime) {
    timezonedDate = format(new Date(`${data.date}T${data.dateTime}`), 'PPP p');
  } else if (data.date) {
    timezonedDate = format(new Date(data.date), 'PPP');
  }

  return (
    <span className="flex items-center text-xs">
      {!timezonedDate && <span className="text-muted-foreground">Pick a due date</span>}
      {timezonedDate && timezonedDate}
      {data.dateTimeZone && ` (${data.dateTimeZone})`}
      {data.repeatPattern && (
        <span className="ml-2 inline-block">
          {' '}
          <RepeatIcon size={14} />
        </span>
      )}
    </span>
  );
};

export default function DueDateSelector({
  data,
  onSaveData,
  includeTime,
  includeRepeat,
  disabled,
  disableClear,
  disablePast,
  disableFuture,
  disableTimeZone,
  isTimezoneReadonly,
  timezonePlaceholderText,
}: DueDateSelectorProps) {
  const generalStartDayOfWeek = useAuthUserSetting('generalStartDayOfWeek', 0);
  const [open, setOpen] = useState(false);
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [dateTimeValue, setDateTimeValue] = useState<string | null>(null);
  const [dateTimeZoneValue, setDateTimeZoneValue] = useState<string | null>(null);
  const [repeatPatternValue, setRepeatPatternValue] = useState<string | null>(null);
  const [repeatEndsAtValue, setRepeatEndsAtValue] = useState<string | null>(null);
  const initialDataRef = useRef(data);

  useEffect(() => {
    setDateValue(data.date ?? null);
    setDateTimeValue(data.dateTime ?? null);
    setDateTimeZoneValue(data.dateTimeZone ?? null);
    setRepeatPatternValue(data.repeatPattern ?? null);
    setRepeatEndsAtValue(data.repeatEndsAt ?? null);
  }, [data.date, data.dateTime, data.dateTimeZone, data.repeatPattern, data.repeatEndsAt]);

  useEffect(() => {
    if (!repeatPatternValue || !dateValue) {
      return;
    }

    // We want to make sure to only set the repeat pattern value if the date has changed
    if (initialDataRef.current.date === dateValue) {
      return;
    }

    try {
      const newStartDate = new Date(
        dateTimeValue ? `${dateValue}T${dateTimeValue}` : `${dateValue}T00:00:00.000`
      );

      const recurrence = Recurrence.fromStringPattern(repeatPatternValue);
      recurrence.updateOptions({
        startsAt: newStartDate,
      });

      setRepeatPatternValue(recurrence.toStringPattern());
    } catch (error) {
      // ignore, as it's most likely an invalid date
    }
  }, [dateValue, dateTimeValue, repeatPatternValue]);

  const onSelectDate = (value?: Date) => {
    setDateValue(value ? format(value, 'yyyy-MM-dd') : null);
  };

  const onRepeatSelectorChange = (value?: string, endsAt?: Date) => {
    setRepeatPatternValue(value ?? null);
    setRepeatEndsAtValue(endsAt ? endsAt.toISOString() : null);
  };

  const onSaveButtonClick = (event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();

    if (dateTimeValue && !isValidTime(dateTimeValue)) {
      sonnerToast.error('Invalid time', {
        description: 'Please enter a valid time',
      });

      return;
    }

    onSaveData({
      date: dateValue || null,
      dateTime: dateTimeValue || null,
      dateTimeZone: dateTimeZoneValue || null,
      repeatPattern: repeatPatternValue || null,
      repeatEndsAt: repeatEndsAtValue || null,
    });

    setOpen(false);
  };

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onSaveData({
      date: null,
      dateTime: null,
      dateTimeZone: null,
      repeatPattern: null,
      repeatEndsAt: null,
    });

    setOpen(false);
  };

  const addMinutes = (minutes: number) => {
    if (!dateTimeValue) {
      setDateTimeValue('00:00');

      return;
    }

    const [hours, mins] = dateTimeValue.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;

    let newHours = Math.floor(totalMinutes / 60);
    let newMins = totalMinutes % 60;

    if (newHours < 0) {
      newHours = 0;
      newMins = 0;
    } else if (newHours >= 24) {
      newHours = 0;
      newMins = 0;
    }

    const paddedHours = String(newHours).padStart(2, '0');
    const paddedMins = String(newMins).padStart(2, '0');

    setDateTimeValue(`${paddedHours}:${paddedMins}`);
  };

  const recurrence = repeatPatternValue ? Recurrence.fromStringPattern(repeatPatternValue) : null;
  const repeatStartsAt = recurrence?.options.startsAt ?? new Date();

  const isDateDisabled = (date: Date) => {
    const now = startOfDay(new Date());
    if (disablePast && date < now) {
      return true;
    }

    if (disableFuture && date > now) {
      return true;
    }

    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full justify-between font-normal"
          data-test="date-selector--trigger-button"
          disabled={disabled}
        >
          <span className="flex">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <DateSelectorText data={data} />
          </span>
          {data.date && !disableClear && (
            <span className="text-muted-foreground rounded-full p-1" onClick={onClearButtonClick}>
              <XIcon />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-auto max-w-[300px] flex-col space-y-4 p-2"
        data-test="date-selector"
      >
        <Calendar
          mode="single"
          disabled={isDateDisabled}
          selected={dateValue ? new Date(dateValue) : undefined}
          onSelect={onSelectDate}
          weekStartsOn={generalStartDayOfWeek}
        />
        {includeRepeat && dateValue && (
          <ErrorBoundary>
            <RepeatSelector
              value={repeatPatternValue ?? undefined}
              startsAt={repeatStartsAt}
              onChangeValue={onRepeatSelectorChange}
              disableTime={!!dateTimeValue}
            />
          </ErrorBoundary>
        )}
        {includeTime && dateValue && (
          <>
            <hr className="border-gray-300 dark:border-gray-700" />
            <div className="space-y-2">
              <div className="flex justify-between align-bottom">
                <div>
                  <Label htmlFor="date-selector--time">Time</Label>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-md border p-1 text-[0.65rem]"
                    onClick={() => addMinutes(-15)}
                  >
                    -15m
                  </button>
                  <button
                    className="rounded-md border p-1 text-[0.65rem]"
                    onClick={() => addMinutes(15)}
                  >
                    +15m
                  </button>
                </div>
              </div>
              <TimeSelector
                value={dateTimeValue ?? undefined}
                onChangeValue={(value) => setDateTimeValue(value ?? null)}
              />
            </div>
            {!disableTimeZone && (
              <div>
                <Label>Timezone</Label>
                <TimezoneSelector
                  value={dateTimeZoneValue}
                  onValueChange={setDateTimeZoneValue}
                  isReadonly={isTimezoneReadonly}
                  placeholderText={timezonePlaceholderText ?? 'Floating timezone'}
                  allowClear={!isTimezoneReadonly}
                />
              </div>
            )}
          </>
        )}
        <div>
          <Button
            variant="default"
            className="w-full"
            onClick={onSaveButtonClick}
            data-test="date-selector--save-button"
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
