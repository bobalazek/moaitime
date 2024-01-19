import { CalendarSearchIcon, MoreVerticalIcon } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

export default function CalendarSettingsDialogUserCalendarsActions() {
  const { setPublicCalendarsDialogOpen } = useCalendarStore();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full p-1 text-sm"
          data-test="calendar--settings--shared-calendars--actions--trigger-button"
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-test="calendar--settings--shared-calendars--actions">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setPublicCalendarsDialogOpen(true);

            setOpen(false);
          }}
        >
          <CalendarSearchIcon className="mr-2 h-4 w-4" />
          <span>Show Public Calendars</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
