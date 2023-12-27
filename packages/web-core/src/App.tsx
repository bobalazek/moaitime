import { Toaster } from '@moaitime/web-ui';

import { AppRoutes } from './AppRoutes';
import { ErrorBoundary } from './features/core/components/ErrorBoundary';
import { useTasksStore } from './features/tasks/state/tasksStore';

function ToastContainer() {
  const { popoverOpen } = useTasksStore();
  const toasterPosition = popoverOpen ? 'top-right' : 'bottom-right';

  return <Toaster position={toasterPosition} />;
}

export function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <ToastContainer />
    </ErrorBoundary>
  );
}
