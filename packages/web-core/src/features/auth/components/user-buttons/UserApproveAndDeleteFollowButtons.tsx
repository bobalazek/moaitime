import { PublicUser } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../state/authStore';

export default function UserApproveAndDeleteFollowButtons({
  user,
  onAfterClick,
  size,
}: {
  user: PublicUser;
  onAfterClick?: () => void;
  size?: 'sm' | 'default' | 'lg';
}) {
  const { auth, approveFollowerUser, removeFollowerUser } = useAuthStore();

  if (user.id === auth?.user.id) {
    return null;
  }

  const onApproveButtonClick = async () => {
    await approveFollowerUser(user.username);

    onAfterClick?.();
  };

  const onDeleteButtonClick = async () => {
    await removeFollowerUser(user.username);

    onAfterClick?.();
  };

  return (
    <div className="flex gap-1">
      <Button onClick={onApproveButtonClick} size={size}>
        Approve
      </Button>
      <Button onClick={onDeleteButtonClick} size={size} variant="outline">
        Delete
      </Button>
    </div>
  );
}
