import { PublicUser } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useSocialStore } from '../../state/socialStore';

export default function UserFollowButton({
  user,
  onAfterClick,
  size,
}: {
  user: PublicUser;
  onAfterClick?: () => void;
  size?: 'sm' | 'default' | 'lg';
}) {
  const { auth } = useAuthStore();
  const { followUser, unfollowUser } = useSocialStore();

  if (user.id === auth?.user.id) {
    return null;
  }

  if (user.myselfIsBlockingThisUser) {
    return null;
  }

  const followButtonText =
    user.myselfIsFollowingThisUser === 'pending'
      ? 'Pending'
      : user.myselfIsFollowingThisUser
        ? 'Unfollow'
        : user.myselfIsFollowedByThisUser
          ? 'Follow Back'
          : 'Follow';

  const onFollowButtonClick = async () => {
    if (user.myselfIsFollowingThisUser) {
      await unfollowUser(user.id);
    } else {
      await followUser(user.id);
    }

    onAfterClick?.();
  };

  return (
    <Button onClick={onFollowButtonClick} size={size} className="h-8 p-2">
      {followButtonText}
    </Button>
  );
}
