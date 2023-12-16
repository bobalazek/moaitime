import { clsx } from 'clsx';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../../calendar/state/calendarStore';

export function CalendarSelector({
  value,
  onChangeValue,
}: {
  value?: string;
  onChangeValue: (value?: string) => void;
}) {
  const { calendars } = useCalendarStore();
  const [open, setOpen] = useState(false);

  const selectedCalendar = calendars.find((calendar) => calendar.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-test="calendar-selector--trigger-button"
        >
          <div>
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: selectedCalendar?.color ?? 'transparent',
              }}
            />
            {selectedCalendar ? selectedCalendar.name : 'Select calendar ...'}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="calendar-selector">
        <Command>
          <CommandInput placeholder="Search calendars ..." />
          <CommandEmpty>No calendar found.</CommandEmpty>
          <CommandGroup>
            {calendars.map((calendar) => (
              <CommandItem
                key={calendar.id}
                value={calendar.id}
                onSelect={(currentValue) => {
                  onChangeValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
                className="cursor-pointer border-l-4 border-l-transparent"
                style={{
                  borderColor: calendar?.color ?? 'transparent',
                }}
              >
                <Check
                  className={clsx(
                    'mr-2 h-4 w-4',
                    value === calendar.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {calendar.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
