import { PublicUser } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useSocialStore } from '../../state/socialStore';

export default function UserBlockButton({
  user,
  onAfterClick,
}: {
  user: PublicUser;
  onAfterClick: () => void;
}) {
  const { auth } = useAuthStore();
  const { blockUser, unblockUser } = useSocialStore();

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
    <Button onClick={onBlockButtonClick} className="h-8 p-2">
      {blockButtonText}
    </Button>
  );
}
