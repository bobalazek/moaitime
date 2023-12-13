import { format } from 'date-fns';
import { MouseEvent, useState } from 'react';
import { FaCalendar, FaTimes } from 'react-icons/fa';

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import TaskDialogDueDateTime from './TaskDialogDueDateTime';

type TaskDialogDueDateProps = {
  date: string | null;
  onDateChange: (value: string | null) => void;
  dateTime: string | null;
  onDateTimeChange: (value: string | null) => void;
};

export const TaskDialogDueDateText = ({
  date,
  dateTime,
}: Pick<TaskDialogDueDateProps, 'date' | 'dateTime'>) => {
  return (
    <span>
      {!date && <span className="text-muted-foreground">Pick a date</span>}
      {date && format(new Date(date), 'PPP')}
      {date && dateTime && <> at {dateTime}</>}
    </span>
  );
};

export default function TaskDialogDueDate({
  date,
  dateTime,
  onDateChange,
  onDateTimeChange,
}: TaskDialogDueDateProps) {
  const { auth } = useAuthStore();
  const [open, setOpen] = useState(false);

  const onSelectDate = (value?: Date) => {
    onDateChange(value ? format(value, 'yyyy-MM-dd') : null);

    if (!value) {
      onDateTimeChange(null);
    }

    setOpen(false);
  };

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onDateChange(null);
    onDateTimeChange(null);

    setOpen(false);
  };

  const calendarStartDayOfWeek = auth?.user?.settings?.calendarStartDayOfWeek ?? 0;

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
            <TaskDialogDueDateText date={date} dateTime={dateTime} />
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
          weekStartsOn={calendarStartDayOfWeek}
        />
        {date && (
          <>
            <hr className="border-gray-700" />
            <TaskDialogDueDateTime dateTime={dateTime} onDateTimeChange={onDateTimeChange} />
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
