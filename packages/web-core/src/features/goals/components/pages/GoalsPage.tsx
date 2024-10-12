import { useEffect } from 'react';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import MoodPageContent from './goals/GoalsPageContent';
import MoodPageHeader from './goals/GoalsPageHeader';

export default function GoalsPage() {
  useEscapeToHome();

  useEffect(() => {
    document.title = 'Goals | MoaiTime';
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="mood">
        <MoodPageHeader />
        <MoodPageContent />
      </div>
    </ErrorBoundary>
  );
}
