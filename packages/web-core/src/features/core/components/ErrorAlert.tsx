import { AlertTriangleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle, Button } from '@moaitime/web-ui';

export type ErrorAlertProps = {
  error: unknown;
};

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Typical developer, am I right? Develops some functionality that has bugs in it and does not even bother providing a fallback. We have notified them and then will be punished, do not worry about that!';

  return (
    <Alert>
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
      <div className="mt-4">
        <Button onClick={() => window.location.reload()} size="sm">
          Reload
        </Button>
      </div>
    </Alert>
  );
};
