import { PublicUser } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../state/authStore';

export default function UserFollowButton({
  user,
  onAfterClick,
  size,
}: {
  user: PublicUser;
  onAfterClick?: () => void;
  size?: 'sm' | 'default' | 'lg';
}) {
  const { followUser, unfollowUser } = useAuthStore();

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
    <Button onClick={onFollowButtonClick} size={size}>
      {followButtonText}
    </Button>
  );
}
