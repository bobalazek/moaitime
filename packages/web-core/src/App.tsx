import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';

import { OAUTH_GOOGLE_CLIENT_ID } from '@moaitime/shared-frontend';
import { SonnerToaster, Toaster, TooltipProvider } from '@moaitime/web-ui';

import { AppRoutes } from './AppRoutes';
import { useAuthUserSetting } from './features/auth/state/authStore';
import { ErrorBoundary } from './features/core/components/ErrorBoundary';
import { queryClient } from './features/core/utils/FetchHelpers';
import { useTasksStore } from './features/tasks/state/tasksStore';
import { ProviderComposer } from './ProviderComposer';

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

const providers = [
  [QueryClientProvider, { client: queryClient }],
  [TooltipProvider],
  OAUTH_GOOGLE_CLIENT_ID && [GoogleOAuthProvider, { clientId: OAUTH_GOOGLE_CLIENT_ID }],
  [Provider],
];

export function App() {
  return (
    <ErrorBoundary>
      <ProviderComposer providers={providers}>
        <AppRoutes />
      </ProviderComposer>
      <ToasterContainer />
      <SonnerToasterContainer />
    </ErrorBoundary>
  );
}
