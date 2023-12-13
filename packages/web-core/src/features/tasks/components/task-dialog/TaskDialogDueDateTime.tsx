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

import TimezoneSelector from '../../../core/components/partials/TimezoneSelector';

type TaskDialogDueDateTimeProps = {
  dateTime: string | null;
  onDateTimeChange: (value: string | null) => void;
  dateTimeZone: string | null;
  onDateTimeZoneChange: (value: string | null) => void;
};

export default function TaskDialogDueDateTime({
  dateTime,
  onDateTimeChange,
  dateTimeZone,
  onDateTimeZoneChange,
}: TaskDialogDueDateTimeProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(dateTime ?? '');
  const [timeZoneValue, setTimeZoneValue] = useState(dateTimeZone ?? null);

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onDateTimeChange(null);

    setTimeValue('');
    setTimeZoneValue(null);

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
    onDateTimeZoneChange(timeZoneValue);

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
          <span className="flex text-xs">
            <FaClock className="mr-2 h-4 w-4" />
            {!dateTime && <span className="text-muted-foreground">Pick a time</span>}
            {dateTime && <span>{dateTime}</span>}
            {dateTimeZone && <span className="ml-2 text-gray-400">({dateTimeZone})</span>}
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
      <PopoverContent className="flex-col space-y-4 p-2" data-test="tasks--due-date--time">
        <div className="space-y-2">
          <Label htmlFor="tasks--task-dialog--due-date--time">Time</Label>
          <Input
            id="tasks--task-dialog--due-date--time"
            value={timeValue}
            onChange={(event) => setTimeValue(event.target.value)}
            onKeyDown={onKeyPress}
            autoComplete="off"
          />
          {/* Add TimeRangesDropdownMenu here, once we sort out the focus issue */}
        </div>
        <div>
          <Label htmlFor="tasks--task-dialog--due-date--timezone">Timezone</Label>
          <TimezoneSelector
            value={timeZoneValue}
            onValueChange={setTimeZoneValue}
            placeholderText="Floating timezone"
            allowClear={true}
          />
        </div>
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
