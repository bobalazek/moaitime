import { useEffect, useRef } from 'react';

import { Toaster } from '@myzenbuddy/web-ui';

import { AppRoutes } from './AppRoutes';
import { ErrorBoundary } from './features/core/components/ErrorBoundary';

export function App() {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    document.body.classList.add('dark');
  }, []);

  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster />
    </ErrorBoundary>
  );
}
