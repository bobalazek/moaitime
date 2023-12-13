import { format } from 'date-fns';
import { MouseEvent, useState } from 'react';
import { FaCalendar, FaTimes } from 'react-icons/fa';

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import TaskDialogDueDateTime from './TaskDialogDueDateTime';

type TaskDialogDueDateProps = {
  date: string | null;
  dateTime: string | null;
  dateTimeZone: string | null;
  onDateChange: (value: string | null) => void;
  onDateTimeChange: (value: string | null) => void;
  onDateTimeZoneChange: (value: string | null) => void;
};

export const TaskDialogDueDateText = ({
  date,
  dateTime,
  dateTimeZone,
}: Pick<TaskDialogDueDateProps, 'date' | 'dateTime' | 'dateTimeZone'>) => {
  return (
    <span className="text-xs">
      {!date && <span className="text-muted-foreground">Pick a date</span>}
      {date && format(new Date(date), 'PPP')}
      {date && dateTime && <> at {dateTime}</>}
      {date && dateTime && dateTimeZone && (
        <span className="ml-2 text-gray-400">({dateTimeZone})</span>
      )}
    </span>
  );
};

export default function TaskDialogDueDate({
  date,
  dateTime,
  dateTimeZone,
  onDateChange,
  onDateTimeChange,
  onDateTimeZoneChange,
}: TaskDialogDueDateProps) {
  const { auth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [dateValue, setDateValue] = useState(date ?? null);
  const [dateTimeValue, setDateTimeValue] = useState(dateTime ?? null);
  const [dateTimeZoneValue, setDateTimeZoneValue] = useState(dateTimeZone ?? null);

  const onSelectDate = (value?: Date) => {
    onDateChange(value ? format(value, 'yyyy-MM-dd') : null);

    if (!value) {
      setDateValue(null);
    }

    setOpen(false);
  };

  const onSaveButtonClick = () => {
    onDateChange(dateValue);
    onDateTimeChange(dateTimeValue);
    onDateTimeZoneChange(dateTimeZoneValue);

    setOpen(false);
  };

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onDateChange(null);
    onDateTimeChange(null);

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
            <TaskDialogDueDateText date={date} dateTime={dateTime} dateTimeZone={dateTimeZone} />
          </span>
          {date && (
            <span
              className="text-muted-foreground rounded-full p-1 hover:bg-slate-600"
              onClick={onClearButtonClick}
            >
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
          selected={date ? new Date(date) : undefined}
          onSelect={onSelectDate}
          weekStartsOn={generalStartDayOfWeek}
        />
        {date && (
          <>
            <hr className="border-gray-700" />
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
