import { useMemo, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
} from '@moaitime/web-ui';

type TimeSelectorProps = {
  value?: string;
  onChangeValue: (value?: string) => void;
};

export default function TimeSelector({ value, onChangeValue }: TimeSelectorProps) {
  const [open, setOpen] = useState(false);
  const times = useMemo(() => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      times.push(`${hour}:00`);
      times.push(`${hour}:15`);
      times.push(`${hour}:30`);
      times.push(`${hour}:45`);
    }

    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    const roundedNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      roundedMinutes
    );

    const roundedNowString = roundedNow.toISOString().split('T')[1].slice(0, 5);

    const index = times.indexOf(roundedNowString);
    const timesBefore = times.slice(0, index);
    const timesAfter = times.slice(index);

    return [...timesAfter, ...timesBefore];
  }, []);

  const timesFiltered = value ? times.filter((time) => time.startsWith(value)) : times;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Input
          id="time-selector"
          value={value ?? ''}
          onChange={(event) => onChangeValue(event.target.value)}
          autoComplete="off"
          maxLength={5}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-32"
        data-test="tasks--time-ranges--dropdown-menu"
      >
        <div className="h-64 overflow-scroll">
          {timesFiltered.length === 0 && (
            <DropdownMenuItem className="text-muted-foreground m-0 text-xs">
              No ranges found
            </DropdownMenuItem>
          )}
          {timesFiltered.map((time) => (
            <DropdownMenuItem
              key={time}
              onClick={() => {
                onChangeValue(time);
                setOpen(false);
              }}
              className="m-0"
            >
              {time}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
