import { Button, sonnerToast } from '@moaitime/web-ui';

import { useAuthStore } from '../../../state/authStore';

export const RequestDataExportButton = () => {
  const { requestDataExport } = useAuthStore();

  const onRequestDataExportButtonClick = async () => {
    try {
      const response = await requestDataExport();

      sonnerToast.success(`Data export requested`, {
        description: response.message ?? `You have successfully requested a data export`,
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Button size="sm" variant="default" onClick={onRequestDataExportButtonClick}>
      Request Data Export
    </Button>
  );
};
