import { CheckIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react';
import { MouseEvent, useState } from 'react';

import { UserNotification } from '@moaitime/shared-common';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useUserNotificationsStore } from '../../state/userNotificationsStore';

export const UserNotificationActions = ({
  userNotification,
}: {
  userNotification: UserNotification;
}) => {
  const { deleteUserNotification, markUserNotificationAsRead, markUserNotificationAsUnread } =
    useUserNotificationsStore();
  const [open, setOpen] = useState(false);

  const onMarkAsReadButtonClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    markUserNotificationAsRead(userNotification.id);

    setOpen(false);
  };

  const onMarkAsUnreadButtonClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    markUserNotificationAsUnread(userNotification.id);

    setOpen(false);
  };

  const onDeleteButtonClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    deleteUserNotification(userNotification.id);

    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-muted/60 rounded-full p-2 transition-all"
          data-test="notifications--user-notification--actions-dropdown-menu--trigger-button"
        >
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-test="notifications--user-notification--actions-dropdown-menu">
        {!userNotification.readAt && (
          <DropdownMenuItem className="cursor-pointer" onClick={onMarkAsReadButtonClick}>
            <CheckIcon className="mr-2 h-4 w-4" />
            <span>Mark as Read</span>
          </DropdownMenuItem>
        )}
        {userNotification.readAt && (
          <DropdownMenuItem className="cursor-pointer" onClick={onMarkAsUnreadButtonClick}>
            <CheckIcon className="mr-2 h-4 w-4" />
            <span>Mark as Unread</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer" onClick={onDeleteButtonClick}>
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
