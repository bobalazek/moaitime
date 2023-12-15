import { format } from 'date-fns';
import { MouseEvent, useState } from 'react';
import { FaCalendar, FaTimes } from 'react-icons/fa';

import { UpdateTask } from '@moaitime/shared-common';
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import TaskDialogDueDateTime from './TaskDialogDueDateTime';

type TaskDialogDueDateProps = {
  data: UpdateTask;
  setData: (value: UpdateTask) => void;
};

export const TaskDialogDueDateText = ({ data }: { data: UpdateTask }) => {
  return (
    <span className="text-xs">
      {!data.dueDate && <span className="text-muted-foreground">Pick a date</span>}
      {data.dueDate && format(new Date(data.dueDate), 'PPP')}
      {data.dueDate && data.dueDateTime && <> at {data.dueDateTime}</>}
      {data.dueDate && data.dueDateTime && data.dueDateTimeZone && (
        <span className="ml-2 text-gray-400">({data.dueDateTimeZone})</span>
      )}
    </span>
  );
};

export default function TaskDialogDueDate({ data, setData }: TaskDialogDueDateProps) {
  const { auth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [dateValue, setDateValue] = useState(data.dueDate ?? null);
  const [dateTimeValue, setDateTimeValue] = useState(data.dueDateTime ?? null);
  const [dateTimeZoneValue, setDateTimeZoneValue] = useState(data.dueDateTimeZone ?? null);

  const onSelectDate = (value?: Date) => {
    setDateValue(value ? format(value, 'yyyy-MM-dd') : null);
  };

  const onSaveButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    setData({
      ...data,
      dueDate: dateValue,
      dueDateTime: dateTimeValue,
      dueDateTimeZone: dateTimeZoneValue,
    });

    setOpen(false);
  };

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    setData({
      ...data,
      dueDate: null,
      dueDateTime: null,
      dueDateTimeZone: null,
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
            <TaskDialogDueDateText data={data} />
          </span>
          {dateValue && (
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
