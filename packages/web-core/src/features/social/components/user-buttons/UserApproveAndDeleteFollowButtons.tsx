import { PublicUser } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useSocialStore } from '../../state/socialStore';

export default function UserApproveAndDeleteFollowButtons({
  user,
  onAfterClick,
}: {
  user: PublicUser;
  onAfterClick?: () => void;
}) {
  const { auth } = useAuthStore();
  const { approveFollowerUser, removeFollowerUser } = useSocialStore();

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
      <Button onClick={onApproveButtonClick} className="h-8 p-2">
        Approve
      </Button>
      <Button onClick={onDeleteButtonClick} className="h-8 p-2" variant="outline">
        Delete
      </Button>
    </div>
  );
}
