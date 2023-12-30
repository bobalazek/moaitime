import { format } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';

import { isValidTime } from '@moaitime/shared-common';
import {
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import TimezoneSelector from './TimezoneSelector';

export type DateSelectorData = {
  date: string | null;
  dateTime: string | null;
  dateTimeZone: string | null;
};

export type DateSelectorProps = {
  data: DateSelectorData;
  onSaveData: (value: DateSelectorData) => void;
  includeTime?: boolean;
  disableClear?: boolean;
  disablePast?: boolean;
  isTimezoneReadonly?: boolean;
  timezonePlaceholderText?: string;
};

export const DateSelectorText = ({ data }: { data: DateSelectorData }) => {
  let timezonedDate: string | null = null;
  if (data.date && data.dateTime) {
    timezonedDate = format(new Date(`${data.date}T${data.dateTime}`), 'PPP p');
  } else if (data.date) {
    timezonedDate = format(new Date(data.date), 'PPP');
  }

  return (
    <span className="text-xs">
      {!timezonedDate && <span className="text-muted-foreground">Pick a date</span>}
      {timezonedDate && timezonedDate}
      {data.dateTimeZone && ` (${data.dateTimeZone})`}
    </span>
  );
};

export default function DateSelector({
  data,
  onSaveData,
  includeTime,
  disableClear,
  disablePast,
  isTimezoneReadonly,
  timezonePlaceholderText,
}: DateSelectorProps) {
  const { toast } = useToast();
  const { auth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [dateTimeValue, setDateTimeValue] = useState<string | null>(null);
  const [dateTimeZoneValue, setDateTimeZoneValue] = useState<string | null>(null);

  useEffect(() => {
    setDateValue(data.date ?? null);
    setDateTimeValue(data.dateTime ?? null);
    setDateTimeZoneValue(data.dateTimeZone ?? null);
  }, [data.date, data.dateTime, data.dateTimeZone]);

  const onSelectDate = (value?: Date) => {
    setDateValue(value ? format(value, 'yyyy-MM-dd') : null);
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    onSaveButtonClick(event);
  };

  const onSaveButtonClick = (event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();

    if (dateTimeValue && !isValidTime(dateTimeValue)) {
      toast({
        title: 'Invalid time',
        description: 'Please enter a valid time',
        variant: 'destructive',
      });

      return;
    }

    onSaveData({
      date: dateValue || null,
      dateTime: dateTimeValue || null,
      dateTimeZone: dateTimeZoneValue || null,
    });

    setOpen(false);
  };

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onSaveData({
      date: null,
      dateTime: null,
      dateTimeZone: null,
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

  const generalStartDayOfWeek = auth?.user?.settings?.generalStartDayOfWeek ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-between font-normal"
          data-test="date-selector--trigger-button"
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
        className="w-auto flex-col space-y-4 p-2"
        data-test="date-selector"
      >
        <Calendar
          mode="single"
          disabled={disablePast ? [{ before: new Date() }] : undefined}
          selected={dateValue ? new Date(dateValue) : undefined}
          onSelect={onSelectDate}
          weekStartsOn={generalStartDayOfWeek}
        />
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
              <Input
                id="date-selector--time"
                value={dateTimeValue ?? ''}
                onChange={(event) => setDateTimeValue(event.target.value)}
                onKeyDown={onKeyPress}
                autoComplete="off"
              />
              {/* Add TimeRangesDropdownMenu here, once we sort out the focus issue */}
            </div>
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
