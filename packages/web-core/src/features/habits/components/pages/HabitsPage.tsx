import { useEffect } from 'react';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import HabisPageHeader from './habits/HabitsPageHeader';
import HabitsPageMain from './habits/HabitsPageMain';

export default function HabitsPage() {
  useEscapeToHome();

  useEffect(() => {
    document.title = 'Habits | MoaiTime';
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="focus">
        <HabisPageHeader />
        <HabitsPageMain />
      </div>
    </ErrorBoundary>
  );
}
