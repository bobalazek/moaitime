import { Link } from 'react-router-dom';

import { PublicUser } from '@moaitime/shared-common';

import { UserAvatar } from '../../../core/components/UserAvatar';
import { useAuthStore } from '../../state/authStore';
import UserFollowButton from '../user-buttons/UserFollowButton';

export default function UserFollowEntry({
  user,
  onAfterClick,
  showRemoveFollowerButton,
}: {
  user: PublicUser;
  onAfterClick?: () => void;
  showRemoveFollowerButton?: boolean;
}) {
  const { removeFollowerUser } = useAuthStore();

  return (
    <div className="flex w-full items-center justify-between overflow-hidden">
      <div className="flex flex-shrink-0 flex-grow">
        <div className="flex flex-shrink items-center gap-2">
          <UserAvatar user={user} sizePx={48} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link to={`/users/${user.username}`} className="font-bold">
                {user.username}
              </Link>
              {showRemoveFollowerButton && user.myselfIsFollowedByThisUser && (
                <button
                  onClick={async () => {
                    await removeFollowerUser(user.id);

                    onAfterClick?.();
                  }}
                  className="text-muted-foreground mr-2 text-xs"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="text-muted-foreground flex-grow text-sm">{user.displayName}</div>
          </div>
        </div>
      </div>
      <div>
        <UserFollowButton user={user} onAfterClick={onAfterClick} size="sm" />
      </div>
    </div>
  );
}
