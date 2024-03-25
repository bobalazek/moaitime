import { Button, sonnerToast } from '@moaitime/web-ui';

import { useAuthStore } from '../../../state/authStore';

export const RequestAccountDeletionButton = () => {
  const { requestAccountDeletion } = useAuthStore();

  const onRequestAccountDeletionButtonClick = async () => {
    try {
      const response = await requestAccountDeletion();

      sonnerToast.success(`Account deletion requested`, {
        description: response.message ?? `You have successfully requested your account deletion`,
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Button size="sm" variant="destructive" onClick={onRequestAccountDeletionButtonClick}>
      Request account deletion
    </Button>
  );
};
