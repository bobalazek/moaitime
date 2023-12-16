import { format } from 'date-fns';
import { MouseEvent, useEffect, useState } from 'react';
import { FaCalendar, FaTimes } from 'react-icons/fa';

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthStore } from '../../../../auth/state/authStore';
import TaskDialogDueDateTime from './DateSelectorTime';

type DateSelectorData = {
  date: string | null;
  dateTime: string | null;
  dateTimeZone: string | null;
};

type DateSelectorProps = {
  data: DateSelectorData;
  onSaveData: (value: DateSelectorData) => void;
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

export default function DateSelector({ data, onSaveData }: DateSelectorProps) {
  const { auth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [dateTimeValue, setDateTimeValue] = useState<string | null>(null);
  const [dateTimeZoneValue, setDateTimeZoneValue] = useState<string | null>(null);

  useEffect(() => {
    setDateValue(data.date ?? null);
    setDateTimeValue(data.dateTime ?? null);
    setDateTimeZoneValue(data.dateTimeZone ?? null);
  }, [data]);

  const onSelectDate = (value?: Date) => {
    setDateValue(value ? format(value, 'yyyy-MM-dd') : null);
  };

  const onSaveButtonClick = (event: MouseEvent) => {
    event.preventDefault();

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
          data-test="tasks--due-date--trigger-button"
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
        data-test="tasks--due-date"
      >
        <Calendar
          mode="single"
          disabled={[{ before: new Date() }]}
          selected={dateValue ? new Date(dateValue) : undefined}
          onSelect={onSelectDate}
          weekStartsOn={generalStartDayOfWeek}
        />
        {dateValue && (
          <>
            <hr className="border-gray-300" />
            <TaskDialogDueDateTime
              dateTime={dateTimeValue}
              dateTimeZone={dateTimeZoneValue}
              onDateTimeChange={setDateTimeValue}
              onDateTimeZoneChange={setDateTimeZoneValue}
            />
          </>
        )}
        <div>
          <Button
            variant="default"
            className="w-full"
            onClick={onSaveButtonClick}
            data-test="tasks--due-date--save-button"
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
