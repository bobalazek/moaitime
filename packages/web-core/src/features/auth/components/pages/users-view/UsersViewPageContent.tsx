import { formatRelative } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';

import { PublicUser } from '@moaitime/shared-common';

import { Button } from '../../../../../../../web-ui/src/components/button';
import { UserAvatar } from '../../../../core/components/UserAvatar';
import { useAuthStore } from '../../../state/authStore';

const UsersViewPageContent = ({ user, refetch }: { user: PublicUser; refetch: () => void }) => {
  const { followUser, unfollowUser, blockUser, unblockUser } = useAuthStore();

  const now = new Date();
  const joinedString = new Date(user.createdAt).toLocaleDateString('default', {
    month: 'long',
    year: 'numeric',
  });

  const showFollowButton = !user.isMyself;
  const showBlockButton = !user.isMyself;

  const followButtonText =
    user.myselfIsFollowingThisUser === 'pending'
      ? 'Pending'
      : user.myselfIsFollowingThisUser
        ? 'Unfollow'
        : user.myselfIsFollowedByThisUser
          ? 'Follow Back'
          : 'Follow';

  const blockButtonText = user.myselfIsBlockingThisUser ? 'Unblock' : 'Block';

  const onFollowButtonClick = async () => {
    if (user.myselfIsFollowingThisUser) {
      await unfollowUser(user.id);
    } else {
      await followUser(user.id);
    }

    refetch();
  };

  const onBlockButtonClick = async () => {
    if (user.myselfIsBlockingThisUser) {
      await unblockUser(user.id);
    } else {
      await blockUser(user.id);
    }

    refetch();
  };

  return (
    <div className="container py-4" data-test="users-view--content">
      <div className="flex items-center gap-6">
        <UserAvatar user={user} sizePx={80} />
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="flex items-center gap-4">
              <span className="text-5xl font-bold">{user.displayName}</span>
              {showFollowButton && (
                <Button onClick={onFollowButtonClick}>{followButtonText}</Button>
              )}
              {showBlockButton && (
                <Button onClick={onBlockButtonClick} variant="destructive">
                  {blockButtonText}
                </Button>
              )}
            </h2>
            <h3 className="text-muted-foreground text-2xl">{user.username}</h3>
          </div>
          <div className="flex gap-4 text-lg">
            <span>
              <b>{user.followersCount}</b> followers
            </span>
            <span> • </span>
            <span>
              <b>{user.followingCount}</b> following
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} /> <span>Joined {joinedString}</span>
            </div>
            {user.lastActiveAt && (
              <div className="flex items-center gap-2">
                <ClockIcon size={16} />{' '}
                <span>Last active {formatRelative(new Date(user.lastActiveAt), now)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersViewPageContent;
