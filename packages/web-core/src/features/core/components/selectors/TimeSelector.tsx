import { XIcon } from 'lucide-react';
import { MouseEvent, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
} from '@moaitime/web-ui';

type TimeSelectorProps = {
  value?: string;
  onChangeValue: (value?: string) => void;
};

// Really painful to get this stupid modal stuff to work correctly. Even now, it kind of works,
// but it's not perfect. The time selector ranges still sometimes just jump when hovered,
// but it's better than before. I'm not sure if it's worth the effort to fix it further.
export default function TimeSelector({ value, onChangeValue }: TimeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
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
  const debouncedSetModal = useDebouncedCallback(setModal, 200);

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onChangeValue('');
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={modal}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Input
            id="time-selector"
            value={value ?? ''}
            onChange={(event) => onChangeValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();

                setOpen(false);
              }
            }}
            autoComplete="off"
            maxLength={5}
            placeholder="Select time ..."
          />
          {value && (
            <div
              className="text-muted-foreground absolute right-2 top-1 z-10 cursor-pointer p-2"
              onPointerDown={onClearButtonClick}
            >
              <XIcon size={16} />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        data-test="tasks--time-ranges--dropdown-menu"
        onMouseOver={() => {
          debouncedSetModal(true);
        }}
        onMouseLeave={() => {
          debouncedSetModal(false);
        }}
      >
        <ScrollArea className="h-64 w-32" type="auto">
          {times.length === 0 && (
            <DropdownMenuItem className="text-muted-foreground m-0 text-xs">
              No ranges found
            </DropdownMenuItem>
          )}
          {times.map((time) => (
            <DropdownMenuItem
              key={time}
              onClick={() => {
                onChangeValue(time);
                setOpen(false);
              }}
              className="m-0 cursor-pointer"
            >
              {time}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
