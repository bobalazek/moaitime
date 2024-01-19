import { MoreVerticalIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

export default function CalendarSettingsDialogMyCalendarsActions() {
  const { setSelectedCalendarDialogOpen, setDeletedCalendarsDialogOpen } = useCalendarStore();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full p-1 text-sm"
          data-test="calendar--settings--my-calendars--actions--trigger-button"
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-test="calendar--settings--my-calendars--actions">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setSelectedCalendarDialogOpen(true, null);

            setOpen(false);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          <span>Add New Calendar</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setDeletedCalendarsDialogOpen(true);

            setOpen(false);
          }}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Show Deleted Calendars</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
