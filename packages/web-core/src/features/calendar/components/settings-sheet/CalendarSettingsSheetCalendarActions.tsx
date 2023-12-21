import { memo, useState } from 'react';
import { FaEdit, FaEllipsisV } from 'react-icons/fa';

import { Calendar } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

const CalendarSettingsSheetCalendarActions = memo(({ calendar }: { calendar: Calendar }) => {
  const { setSelectedCalendarDialogOpen } = useCalendarStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute right-1 top-0 ml-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-1 text-sm"
            data-test="calendar--settings-sheet--calendar--actions--dropdown-menu--trigger-button"
          >
            <FaEllipsisV className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          data-test="calendar--settings-sheet--calendar--actions--dropdown-menu"
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();

              setSelectedCalendarDialogOpen(true, calendar);

              setOpen(false);
            }}
          >
            <FaEdit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export default CalendarSettingsSheetCalendarActions;
