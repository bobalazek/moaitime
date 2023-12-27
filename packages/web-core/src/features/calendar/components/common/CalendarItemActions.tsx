import { memo, MouseEvent, useState } from 'react';
import { FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';

import { Calendar } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

const CalendarItemActions = memo(({ calendar }: { calendar: Calendar }) => {
  const {
    setSelectedCalendarDialogOpen,
    deleteCalendar,
    undeleteCalendar,
    setCalendarDeleteAlertDialogOpen,
  } = useCalendarStore();
  const [open, setOpen] = useState(false);

  const onEditButtonClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedCalendarDialogOpen(true, calendar);

    setOpen(false);
  };

  const onDeleteButtonClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    deleteCalendar(calendar.id);

    setOpen(false);
  };

  const onUndeleteButtonClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    undeleteCalendar(calendar.id);

    setOpen(false);
  };

  const onHardDeleteButtonClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setCalendarDeleteAlertDialogOpen(true, calendar);

    setOpen(false);
  };

  return (
    <div className="absolute right-1 top-0 ml-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-1 text-sm"
            data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"
          >
            <FaEllipsisV className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          data-test="calendar--calendar-item--actions--dropdown-menu"
        >
          {!calendar.deletedAt && (
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={onEditButtonClick}>
                <FaEdit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={onDeleteButtonClick}
              >
                <FaTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          )}
          {calendar.deletedAt && (
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={onUndeleteButtonClick}>
                <FaTrash className="mr-2 h-4 w-4" />
                <span>Undelete</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={onHardDeleteButtonClick}
              >
                <FaTrash className="mr-2 h-4 w-4" />
                <span>Hard Delete</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export default CalendarItemActions;
