import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import MoodPageContent from './mood/MoodPageContent';
import MoodPageHeader from './mood/MoodPageHeader';

export default function MoodPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Mood | MoaiTime';
  }, []);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const openDialogs = document.querySelectorAll('[role="dialog"]');
      if (openDialogs.length > 0) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();

        navigate('/');
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
