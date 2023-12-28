import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { memo, useState } from 'react';

import { Calendar } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ToastAction,
  useToast,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

const CalendarItemActions = memo(({ calendar }: { calendar: Calendar }) => {
  const {
    setSelectedCalendarDialogOpen,
    deleteCalendar,
    undeleteCalendar,
    setCalendarDeleteAlertDialogOpen,
  } = useCalendarStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onEditButtonClick = async () => {
    setSelectedCalendarDialogOpen(true, calendar);

    setOpen(false);
  };

  const onDeleteButtonClick = async () => {
    try {
      await deleteCalendar(calendar.id);

      setOpen(false);

      toast({
        title: `Calendar "${calendar.name}" Deleted`,
        description: 'The calendar was successfully deleted!',
        action: (
          <ToastAction altText="Undo" onClick={onUndeleteButtonClick}>
            Undo
          </ToastAction>
        ),
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onUndeleteButtonClick = async () => {
    try {
      await undeleteCalendar(calendar.id);

      setOpen(false);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onHardDeleteButtonClick = async () => {
    try {
      setCalendarDeleteAlertDialogOpen(true, calendar);

      setOpen(false);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <div className="absolute right-1 top-0 ml-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-1 text-sm"
            data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"
          >
            <MoreVerticalIcon className="h-4 w-4" />
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
                <PencilIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={onDeleteButtonClick}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          )}
          {calendar.deletedAt && (
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={onUndeleteButtonClick}>
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Undelete</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={onHardDeleteButtonClick}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
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
