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
        <div className="container m-auto max-w-[960px] flex-grow py-4">
          <h1 className="mb-4 text-3xl font-semibold">Feed</h1>
          <div>HERE WE SHALL SEE THE FEED</div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
