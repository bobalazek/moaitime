import { MoreVerticalIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { memo, useState } from 'react';

import { Calendar, UserCalendar } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

const CalendarItemActions = memo(
  ({
    calendar,
    userCalendar,
    showAddUserCalendar,
  }: {
    calendar: Calendar;
    userCalendar?: UserCalendar;
    showAddUserCalendar?: boolean;
  }) => {
    const {
      setSelectedUserCalendarDialogOpen,
      setSelectedCalendarDialogOpen,
      deleteCalendar,
      undeleteCalendar,
      setCalendarDeleteAlertDialogOpen,
      addUserCalendar,
      deleteUserCalendar,
    } = useCalendarStore();
    const [open, setOpen] = useState(false);

    // Handlers
    const onDeleteButtonClick = async () => {
      try {
        await deleteCalendar(calendar.id);

        setOpen(false);

        sonnerToast.success(`Calendar "${calendar.name}" deleted`, {
          description: 'The calendar was successfully deleted!',
          action: {
            label: 'Undo',
            onClick: () => onUndeleteButtonClick(),
          },
        });
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    const onUndeleteButtonClick = async () => {
      try {
        await undeleteCalendar(calendar.id);

        setOpen(false);

        sonnerToast.success(`Calendar "${calendar.name}" undeleted`, {
          description: 'The calendar was successfully undeleted!',
          action: {
            label: 'Undo',
            onClick: () => onUndeleteButtonClick(),
          },
        });
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

    const onAddToSharedButtonClick = async () => {
      try {
        await addUserCalendar({ calendarId: calendar.id });

        setOpen(false);

        sonnerToast.success(`Calendar "${calendar.name}" added to shared calendars`, {
          description: 'The calendar was successfully added to your shared calendars!',
          action: {
            label: 'Undo',
            onClick: () => onRemoveFromSharedButtonClick(),
          },
        });
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    const onRemoveFromSharedButtonClick = async () => {
      if (!userCalendar) {
        sonnerToast.error('Oops!', {
          description: 'No calendar selected',
        });

        return;
      }

      try {
        await deleteUserCalendar(userCalendar.id);

        setOpen(false);

        sonnerToast.success(`Calendar "${calendar.name}" removed from shared calendars`, {
          description: 'The calendar was successfully removed from your shared calendars!',
          action: {
            label: 'Undo',
            onClick: () => onAddToSharedButtonClick(),
          },
        });
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    const onEditSharedButtonClick = async () => {
      if (!userCalendar) {
        sonnerToast.error('Oops!', {
          description: 'No calendar selected',
        });

        return;
      }

      try {
        setSelectedUserCalendarDialogOpen(true, userCalendar);

        setOpen(false);
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    // Actions
    const actions: JSX.Element[] = [];

    if (!calendar.deletedAt && calendar.permissions?.canUpdate) {
      actions.push(
        <DropdownMenuItem
          key="edit"
          className="cursor-pointer"
          onClick={async () => {
            setSelectedCalendarDialogOpen(true, calendar);

            setOpen(false);
          }}
        >
          <PencilIcon className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
      );
    }

    if (!calendar.deletedAt && calendar.permissions?.canDelete) {
      actions.push(
        <DropdownMenuItem
          key="delete"
          variant="destructive"
          className="cursor-pointer"
          onClick={onDeleteButtonClick}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      );
    }

    if (calendar.deletedAt) {
      actions.push(
        <DropdownMenuItem key="undelete" className="cursor-pointer" onClick={onUndeleteButtonClick}>
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Undelete</span>
        </DropdownMenuItem>
      );
      actions.push(
        <DropdownMenuItem
          key="hard-delete"
          variant="destructive"
          className="cursor-pointer"
          onClick={onHardDeleteButtonClick}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Hard Delete</span>
        </DropdownMenuItem>
      );
    }

    if (showAddUserCalendar && !userCalendar) {
      actions.push(
        <DropdownMenuItem
          key="add-shared"
          className="cursor-pointer"
          onClick={onAddToSharedButtonClick}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          <span>Add</span>
        </DropdownMenuItem>
      );
    }

    if (showAddUserCalendar && userCalendar) {
      actions.push(
        <DropdownMenuItem
          key="edit-shared"
          className="cursor-pointer"
          onClick={onEditSharedButtonClick}
        >
          <PencilIcon className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
      );
      actions.push(
        <DropdownMenuItem
          key="remove-shared"
          variant="destructive"
          className="cursor-pointer"
          onClick={onRemoveFromSharedButtonClick}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Remove</span>
        </DropdownMenuItem>
      );
    }

    if (actions.length === 0) {
      return null;
    }

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
            {actions}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

export default CalendarItemActions;
