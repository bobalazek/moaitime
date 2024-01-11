import { QueryClientProvider } from '@tanstack/react-query';

import { SonnerToaster, Toaster } from '@moaitime/web-ui';

import { AppRoutes } from './AppRoutes';
import { useAuthUserSetting } from './features/auth/state/authStore';
import { ErrorBoundary } from './features/core/components/ErrorBoundary';
import { queryClient } from './features/core/utils/FetchHelpers';
import { useTasksStore } from './features/tasks/state/tasksStore';

function ToasterContainer() {
  const { popoverOpen } = useTasksStore();
  const toasterPosition = popoverOpen ? 'top-right' : 'bottom-right';

  return <Toaster position={toasterPosition} />;
}

function SonnerToasterContainer() {
  const { popoverOpen } = useTasksStore();

  const toasterPosition = popoverOpen ? 'top-right' : 'bottom-right';
  const theme = useAuthUserSetting('generalTheme', 'system');

  return <SonnerToaster theme={theme} position={toasterPosition} closeButton />;
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
      <ToasterContainer />
      <SonnerToasterContainer />
    </ErrorBoundary>
  );
}
