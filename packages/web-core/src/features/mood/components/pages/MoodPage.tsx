import { useEffect } from 'react';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import MoodPageContent from './mood/MoodPageContent';
import MoodPageHeader from './mood/MoodPageHeader';

export default function MoodPage() {
  useEscapeToHome();

  useEffect(() => {
    document.title = 'Mood | MoaiTime';
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
