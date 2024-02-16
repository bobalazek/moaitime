import { Link } from 'react-router-dom';

import { PublicUser } from '@moaitime/shared-common';

import { UserAvatar } from '../../../core/components/UserAvatar';
import UserFollowButton from '../user-buttons/UserFollowButton';

export default function UserFollowEntry({
  user,
  onAfterClick,
}: {
  user: PublicUser;
  onAfterClick?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UserAvatar user={user} sizePx={48} />
        <div>
          <Link to={`/users/${user.username}`} className="font-bold">
            {user.username}
          </Link>
          <div className="text-muted-foreground text-sm">{user.displayName}</div>
        </div>
      </div>
      <div>
        <UserFollowButton user={user} onAfterClick={onAfterClick} size="sm" />
      </div>
    </div>
  );
}
