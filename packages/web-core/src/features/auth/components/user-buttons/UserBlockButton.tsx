import { PublicUser } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../state/authStore';

export default function UserBlockButton({
  user,
  onAfterClick,
  size,
}: {
  user: PublicUser;
  onAfterClick: () => void;
  size?: 'sm' | 'default' | 'lg';
}) {
  const { auth, blockUser, unblockUser } = useAuthStore();

  if (user.id === auth?.user.id) {
    return null;
  }

  const blockButtonText = user.myselfIsBlockingThisUser ? 'Unblock' : 'Block';

  const onBlockButtonClick = async () => {
    if (user.myselfIsBlockingThisUser) {
      await unblockUser(user.id);
    } else {
      await blockUser(user.id);
    }

    onAfterClick();
  };

  return (
    <Button onClick={onBlockButtonClick} size={size}>
      {blockButtonText}
    </Button>
  );
}
