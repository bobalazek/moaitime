import { MoreVerticalIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { memo, useState } from 'react';

import { Calendar } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

const CalendarItemActions = memo(({ calendar }: { calendar: Calendar }) => {
  const {
    sharedCalendars,
    setSelectedCalendarDialogOpen,
    deleteCalendar,
    undeleteCalendar,
    setCalendarDeleteAlertDialogOpen,
    addSharedCalendar,
    removeSharedCalendar,
  } = useCalendarStore();
  const [open, setOpen] = useState(false);

  const isShared = sharedCalendars.some((sharedCalendar) => sharedCalendar.id === calendar.id);

  // Handlers
  const onEditButtonClick = async () => {
    setSelectedCalendarDialogOpen(true, calendar);

    setOpen(false);
  };

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
      await addSharedCalendar(calendar.id);

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
    try {
      await removeSharedCalendar(calendar.id);

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

  // Actions
  const actions: JSX.Element[] = [];

  if (!calendar.deletedAt && calendar.permissions?.canUpdate) {
    actions.push(
      <DropdownMenuItem key="edit" className="cursor-pointer" onClick={onEditButtonClick}>
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

  if (calendar.permissions?.canAddShared && !isShared) {
    actions.push(
      <DropdownMenuItem
        key="add-shared"
        className="cursor-pointer"
        onClick={onAddToSharedButtonClick}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        <span>Add to Shared</span>
      </DropdownMenuItem>
    );
  }

  if (isShared) {
    actions.push(
      <DropdownMenuItem
        key="remove-shared"
        variant="destructive"
        className="cursor-pointer"
        onClick={onRemoveFromSharedButtonClick}
      >
        <TrashIcon className="mr-2 h-4 w-4" />
        <span>Remove from Shared</span>
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
});

export default CalendarItemActions;
