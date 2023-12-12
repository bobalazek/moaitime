import { format } from 'date-fns';
import { useState } from 'react';
import { FaCalendar, FaClock, FaTimes } from 'react-icons/fa';

import { isValidTime } from '@myzenbuddy/shared-common';
import {
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from '@myzenbuddy/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';

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
  const { toast } = useToast();
  const { auth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(dateTime ?? '');

  const onSaveButtonClick = () => {
    if (timeValue && !isValidTime(timeValue)) {
      toast({
        title: 'Invalid time',
        description: 'Please enter a valid time',
        variant: 'destructive',
      });

      return;
    }

    onDateTimeChange(timeValue ?? null);

    setTimePopoverOpen(false);
  };

  const calendarStartDayOfWeek = auth?.user?.settings?.calendarStartDayOfWeek ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex justify-between text-left font-normal">
          <span className="flex">
            <FaCalendar className="mr-2 h-4 w-4" />
            <TaskDialogDueDateText date={date} dateTime={dateTime} />
          </span>
          {date && (
            <span
              className="text-muted-foreground rounded-full p-1 hover:bg-slate-600"
              onClick={(e) => {
                e.preventDefault();

                onDateChange(null);
                onDateTimeChange(null);

                setOpen(false);
              }}
            >
              <FaTimes />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto flex-col space-y-4 p-2">
        <Calendar
          mode="single"
          disabled={[{ before: new Date() }]}
          selected={date ? new Date(date) : undefined}
          onSelect={(value) => {
            onDateChange(value ? format(value, 'yyyy-MM-dd') : null);

            if (!value) {
              onDateTimeChange(null);
              setTimeValue('');
            }

            setOpen(false);
          }}
          weekStartsOn={calendarStartDayOfWeek}
        />
        <hr className="border-gray-700" />
        <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex w-full justify-between text-left font-normal">
              <span className="flex">
                <FaClock className="mr-2 h-4 w-4" />
                {!dateTime && <span className="text-muted-foreground">Pick a time</span>}
                {dateTime && <span>{dateTime}</span>}
              </span>
              {dateTime && (
                <span
                  className="text-muted-foreground rounded-full p-1 hover:bg-slate-600"
                  onClick={(e) => {
                    e.preventDefault();

                    onDateTimeChange(null);

                    setTimeValue('');
                    setTimePopoverOpen(false);
                  }}
                >
                  <FaTimes />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 flex-col space-y-4 p-2">
            <div>
              <Label htmlFor="task-dialog--due-date-time">Time</Label>
              <Input
                id="task-dialog--due-date-time"
                value={timeValue}
                onChange={(e) => {
                  setTimeValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') {
                    return;
                  }

                  onSaveButtonClick();
                }}
              />
            </div>
            <div>
              <Button variant="default" className="w-full" onClick={onSaveButtonClick}>
                Save
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </PopoverContent>
    </Popover>
  );
}
