import { Toaster } from '@moaitime/web-ui';

import { AppRoutes } from './AppRoutes';
import { ErrorBoundary } from './features/core/components/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster />
    </ErrorBoundary>
  );
}
