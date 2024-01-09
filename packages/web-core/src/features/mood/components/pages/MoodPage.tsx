import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useMoodShortcuts } from '../../hooks/useMoodShortcuts';
import MoodPageContent from './mood/MoodPageContent';
import MoodPageHeader from './mood/MoodPageHeader';

export default function MoodPage() {
  useMoodShortcuts();

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="mood">
        <MoodPageHeader />
        <MoodPageContent />
      </div>
    </ErrorBoundary>
  );
}
