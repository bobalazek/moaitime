import { useEffect } from 'react';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import SocialPageHeader from './layout/SocialPageHeader';

export default function SocialPage() {
  useEscapeToHome();

  useEffect(() => {
    document.title = `Social | MoaiTime`;
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="social--index">
        <SocialPageHeader />
        TODO
      </div>
    </ErrorBoundary>
  );
}
