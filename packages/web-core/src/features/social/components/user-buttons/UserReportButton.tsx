import { PublicUser } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useSocialStore } from '../../state/socialStore';

export default function UserReportButton({
  user,
  onAfterClick,
  size,
}: {
  user: PublicUser;
  onAfterClick?: () => void;
  size?: 'sm' | 'default' | 'lg';
}) {
  const { auth } = useAuthStore();
  const { setUserReportDialogOpen } = useSocialStore();

  if (user.id === auth?.user.id) {
    return null;
  }

  const reportButtonText = 'Report';

  const onReportButtonClick = async () => {
    await setUserReportDialogOpen(true, user);

    onAfterClick?.();
  };

  return (
    <Button onClick={onReportButtonClick} size={size} variant="destructive">
      {reportButtonText}
    </Button>
  );
}
