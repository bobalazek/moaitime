import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useMoodShortcuts } from '../../hooks/useMoodShortcuts';
import MoodPageHeader from './mood/MoodPageHeader';

export default function MoodPage() {
  useMoodShortcuts();

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="mood">
        <MoodPageHeader />
        <div className="p-4 text-center">TODO</div>
      </div>
    </ErrorBoundary>
  );
}
