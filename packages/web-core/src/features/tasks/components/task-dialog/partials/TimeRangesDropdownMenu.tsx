import { useMemo } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ScrollArea,
} from '@moaitime/web-ui';

type TimeRangesDropdownMenuProps = {
  onSelect: (value: string | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TimeRangesDropdownMenu({
  onSelect,
  open,
  onOpenChange,
}: TimeRangesDropdownMenuProps) {
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

  // The reason we need that empty div is, because the dropdown menu needs a child to be able to position itself.

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <div />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-32"
        data-test="tasks--time-ranges--dropdown-menu"
      >
        <ScrollArea className="h-64">
          {times.map((time) => (
            <DropdownMenuItem
              key={time}
              onClick={() => {
                onSelect(time);
                onOpenChange(false);
              }}
              className="m-0"
            >
              {time}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
