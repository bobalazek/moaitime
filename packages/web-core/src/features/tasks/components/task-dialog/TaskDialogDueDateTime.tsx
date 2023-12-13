import { KeyboardEvent, MouseEvent, useState } from 'react';
import { FaClock, FaTimes } from 'react-icons/fa';

import { isValidTime } from '@moaitime/shared-common';
import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from '@moaitime/web-ui';

import TimeRangesDropdownMenu from './partials/TimeRangesDropdownMenu';

type TaskDialogDueDateTimeProps = {
  dateTime: string | null;
  onDateTimeChange: (value: string | null) => void;
};

export default function TaskDialogDueDateTime({
  dateTime,
  onDateTimeChange,
}: TaskDialogDueDateTimeProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [timeRangesDropdownMenuOpen, setTimeRangesDropdownMenuOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(dateTime ?? '');

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onDateTimeChange(null);

    setTimeValue('');
    setOpen(false);
  };

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

    setOpen(false);
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    onSaveButtonClick();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full justify-between font-normal"
          data-test="tasks--due-date--time--trigger-button"
        >
          <span className="flex">
            <FaClock className="mr-2 h-4 w-4" />
            {!dateTime && <span className="text-muted-foreground">Pick a time</span>}
            {dateTime && <span>{dateTime}</span>}
          </span>
          {dateTime && (
            <span
              className="text-muted-foreground rounded-full p-1 hover:bg-slate-600"
              onClick={onClearButtonClick}
            >
              <FaTimes />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 flex-col space-y-4 p-2" data-test="tasks--due-date--time">
        <div className="space-y-2">
          <Label htmlFor="task-dialog--due-date-time">Time</Label>
          <Input
            id="task-dialog--due-date-time"
            value={timeValue}
            onChange={(event) => setTimeValue(event.target.value)}
            onKeyDown={onKeyPress}
            onFocus={() => setTimeRangesDropdownMenuOpen(true)}
          />
          <TimeRangesDropdownMenu
            open={timeRangesDropdownMenuOpen}
            onOpenChange={setTimeRangesDropdownMenuOpen}
            onSelect={(value) => setTimeValue(value ?? '')}
          />
        </div>
        <div>
          <Button variant="default" className="w-full" onClick={onSaveButtonClick}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
