import { useEffect } from 'react';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import StatisticsPageHeader from './statistics/StatisticsPageHeader';
import StatisticsPageMain from './statistics/StatisticsPageMain';

export default function StatisticsPage() {
  useEscapeToHome();

  useEffect(() => {
    document.title = 'Statistics | MoaiTime';
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
