import { clsx } from 'clsx';
import { CheckIcon, ChevronsUpDownIcon, UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Calendar } from '@moaitime/shared-common';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../../calendar/state/calendarStore';
import { useTeamsStore } from '../../../teams/state/teamsStore';

export type CalendarSelectorProps = {
  value?: string;
  onChangeValue: (value?: string, calendar?: Calendar) => void;
  isReadonly?: boolean;
  autoSelectFirstIfValueNoneSet?: boolean;
};

export function CalendarSelector({
  value,
  onChangeValue,
  isReadonly,
  autoSelectFirstIfValueNoneSet,
}: CalendarSelectorProps) {
  const { calendars } = useCalendarStore();
  const { getTeamSync } = useTeamsStore();
  const [open, setOpen] = useState(false);

  const selectedCalendar = calendars.find((calendar) => calendar.id === value) ?? null;
  const team = selectedCalendar?.teamId ? getTeamSync(selectedCalendar.teamId) : null;

  useEffect(() => {
    if (!autoSelectFirstIfValueNoneSet) {
      return;
    }

    if (!selectedCalendar) {
      onChangeValue(calendars[0]?.id ?? undefined);
    }
  }, [autoSelectFirstIfValueNoneSet, calendars, selectedCalendar, onChangeValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isReadonly}
          data-test="calendar-selector--trigger-button"
        >
          <div className="truncate">
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: selectedCalendar?.color ?? 'transparent',
              }}
            />
            {selectedCalendar ? selectedCalendar.name : 'Select calendar ...'}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="calendar-selector">
        <Command>
          <CommandInput placeholder="Search calendars ..." />
          <CommandEmpty>No calendar found.</CommandEmpty>
          <CommandList>
            <CommandGroup className="w-full max-w-[420px]">
              {calendars.map((calendar) => (
                <CommandItem
                  key={calendar.id}
                  value={calendar.id}
                  onSelect={(currentValue) => {
                    onChangeValue(currentValue === value ? '' : currentValue, calendar);
                    setOpen(false);
                  }}
                  className="cursor-pointer border-l-4 border-l-transparent"
                  style={{
                    borderColor: calendar?.color ?? 'transparent',
                  }}
                >
                  <CheckIcon
                    className={clsx(
                      'mr-2 h-4 w-4',
                      value === calendar.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span>{calendar.name}</span>
                  {calendar?.teamId && (
                    <span
                      className="ml-2"
                      title={`This calendar is shared with ${team?.name ?? 'your team'}`}
                    >
                      <UsersIcon
                        className="inline text-gray-400"
                        size={16}
                        style={{
                          color: team?.color ?? undefined,
                        }}
                      />
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
