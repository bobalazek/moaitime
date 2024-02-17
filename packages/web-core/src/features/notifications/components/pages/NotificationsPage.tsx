import { useEffect } from 'react';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import NotificationsPageContent from './notifications/NotificationsPageContent';
import NotificationsPageHeader from './notifications/NotificationsPageHeader';

export default function NotificationsPage() {
  useEscapeToHome();

  useEffect(() => {
    document.title = 'Notifications | MoaiTime';
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="notifications">
        <NotificationsPageHeader />
        <NotificationsPageContent />
      </div>
    </ErrorBoundary>
  );
}
