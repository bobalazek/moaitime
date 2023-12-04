import { useEffect } from 'react';

import { Toaster } from '@myzenbuddy/web-ui';

import { AppRoutes } from './AppRoutes';
import { ErrorBoundary } from './features/core/components/ErrorBoundary';
import { initializeApp } from './features/core/utils/BootstrapHelpers';

export function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster />
    </ErrorBoundary>
  );
}
