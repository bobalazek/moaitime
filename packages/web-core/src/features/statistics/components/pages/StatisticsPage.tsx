import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import StatisticsPageHeader from './statistics/StatisticsPageHeader';
import StatisticsPageMain from './statistics/StatisticsPageMain';

export default function StatisticsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
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
      <div className="flex h-screen flex-col" data-test="statistics">
        <StatisticsPageHeader />
        <StatisticsPageMain />
      </div>
    </ErrorBoundary>
  );
}
