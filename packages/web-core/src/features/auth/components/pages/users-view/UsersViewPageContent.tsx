import { formatRelative } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PublicUser } from '@moaitime/shared-common';

import { UserAvatar } from '../../../../core/components/UserAvatar';
import { getUserLastActive } from '../../../utils/UserHelpers';

const UsersViewPageContent = ({ user }: { user: PublicUser }) => {
  const [lastActiveAt, setLastActiveAt] = useState<Date | null>(null);

  const now = new Date();
  const joinedAtString = new Date(user.createdAt).toLocaleDateString('default', {
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    (async () => {
      setLastActiveAt(await getUserLastActive(user.username));
    })();
  }, [user.username]);

  return (
    <div className="container py-4" data-test="users-view--content">
      <div className="flex items-center gap-6">
        <UserAvatar user={user} lastActiveAt={lastActiveAt ?? undefined} sizePx={80} />
        <div className="flex flex-col gap-1">
          <h2 className="text-5xl font-bold">{user.displayName}</h2>
          <h3 className="text-muted-foreground text-2xl">{user.username}</h3>
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} /> <span>Joined {joinedAtString}</span>
          </div>
          {lastActiveAt && (
            <div className="flex items-center gap-2">
              <ClockIcon size={16} /> <span>Last active {formatRelative(lastActiveAt, now)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersViewPageContent;
