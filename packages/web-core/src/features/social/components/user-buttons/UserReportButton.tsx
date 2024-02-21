import { PublicUser } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useSocialStore } from '../../state/socialStore';

export default function UserReportButton({
  user,
  onAfterClick,
}: {
  user: PublicUser;
  onAfterClick?: () => void;
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
    <Button onClick={onReportButtonClick} className="h-8 p-2" variant="destructive">
      {reportButtonText}
    </Button>
  );
}
