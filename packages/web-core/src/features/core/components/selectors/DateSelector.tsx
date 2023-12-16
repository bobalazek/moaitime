import { format } from 'date-fns';
import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { FaCalendar, FaTimes } from 'react-icons/fa';

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
  disablePast?: boolean;
};

export const DateSelectorText = ({ data }: { data: DateSelectorData }) => {
  return (
    <span className="text-xs">
      {!data.date && <span className="text-muted-foreground">Pick a date</span>}
      {data.date && format(new Date(data.date), 'PPP')}
      {data.date && data.dateTime && <> at {data.dateTime}</>}
      {data.date && data.dateTime && data.dateTimeZone && (
        <span className="ml-2 text-gray-400">({data.dateTimeZone})</span>
      )}
    </span>
  );
};

export default function DateSelector({
  data,
  onSaveData,
  includeTime,
  disablePast,
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
      date: dateValue,
      dateTime: dateTimeValue,
      dateTimeZone: dateTimeZoneValue,
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
            <FaCalendar className="mr-2 h-4 w-4" />
            <DateSelectorText data={data} />
          </span>
          {data.date && (
            <span className="text-muted-foreground rounded-full p-1" onClick={onClearButtonClick}>
              <FaTimes />
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
              <Label htmlFor="date-selector--time">Time</Label>
              <Input
                id="dae-selector--time"
                value={dateTimeValue ?? ''}
                onChange={(event) => setDateTimeValue(event.target.value)}
                onKeyDown={onKeyPress}
                autoComplete="off"
              />
              {/* Add TimeRangesDropdownMenu here, once we sort out the focus issue */}
            </div>
            {dateTimeValue && (
              <div>
                <Label htmlFor="date-selector--timezone">Timezone</Label>
                <TimezoneSelector
                  value={dateTimeZoneValue}
                  onValueChange={setDateTimeZoneValue}
                  placeholderText="Floating timezone"
                  allowClear={true}
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
