import { CheckCheckIcon, MoreVerticalIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Switch,
} from '@moaitime/web-ui';

import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import UserProfileDropdown from '../../../../social/components/pages/layout/UserProfileDropdown';
import { useUserNotificationsStore } from '../../../state/userNotificationsStore';

const NotificationsPageHeader = () => {
  const { markAllUserNotificationsAsRead, unreadOnly, setUnreadOnly } = useUserNotificationsStore();

  const onMarkAllAsReadButtonClick = async () => {
    await markAllUserNotificationsAsRead();
  };

  return (
    <LayoutPageHeader testKey="notifications" title="Notifications">
      <div className="flex-grow" />
      <div className="flex items-center gap-2">
        <Label htmlFor="unread-only" className="text-xs">
          Show unread only
        </Label>
        <Switch
          id="unread-only"
          checked={unreadOnly}
          onCheckedChange={() => setUnreadOnly(!unreadOnly)}
          data-test="notifications--header--unread-only-switch"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-1 text-sm"
            data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={onMarkAllAsReadButtonClick}>
            <CheckCheckIcon className="mr-2 h-4 w-4" />
            <span>Mark all as read</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfileDropdown />
    </LayoutPageHeader>
  );
};

export default NotificationsPageHeader;
