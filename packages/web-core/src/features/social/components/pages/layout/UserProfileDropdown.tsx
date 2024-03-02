import { BellIcon, CogIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useAuthStore } from '../../../../auth/state/authStore';
import { UserAvatar } from '../../../../core/components/UserAvatar';
import { useUserNotificationsStore } from '../../../../notifications/state/userNotificationsStore';
import { useSettingsStore } from '../../../../settings/state/settingsStore';

export default function UserProfileDropdown() {
  const { auth, logout } = useAuthStore();
  const { setDialogOpen } = useSettingsStore();
  const { unreadUserNotificationsCount } = useUserNotificationsStore();

  if (!auth) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title="Go to profile"
        data-test="social--header--user-profile--dropdown-menu--trigger-button"
      >
        <UserAvatar user={auth.user} sizePx={32} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-40"
        data-test="social--header--user-profile--dropdown-menu"
      >
        <DropdownMenuItem asChild>
          <Link to={`/social/users/${auth.user.username}`} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/notifications`} className="cursor-pointer">
            <BellIcon className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            {unreadUserNotificationsCount && unreadUserNotificationsCount > 0 ? (
              <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
                {unreadUserNotificationsCount > 9 ? '9+' : unreadUserNotificationsCount}
              </div>
            ) : null}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <CogIcon className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={() => {
            logout();
          }}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
