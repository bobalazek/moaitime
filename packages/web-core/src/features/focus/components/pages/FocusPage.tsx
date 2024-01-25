import { useEffect, useRef } from 'react';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import { useFocusSessionsStore } from '../../state/focusSessionsStore';
import FocusPageHeader from './focus/FocusPageHeader';
import FocusPageMain from './focus/FocusPageMain';

export default function FocusPage() {
  const { reloadCurrentFocusSession } = useFocusSessionsStore();
  const isInitialized = useRef(false);

  useEscapeToHome();

  useEffect(() => {
    document.title = 'Focus | MoaiTime';
  }, []);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    reloadCurrentFocusSession();
  }, [reloadCurrentFocusSession]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="focus">
        <FocusPageHeader />
        <FocusPageMain />
      </div>
    </ErrorBoundary>
  );
}
