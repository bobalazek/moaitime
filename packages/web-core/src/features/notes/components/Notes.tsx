import { NotebookPenIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';

export default function Notes() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <button
        className="text-xl text-white transition-all"
        onClick={() => {
          navigate('/notes');
        }}
        title="Open notes"
        data-test="notes--open-button"
      >
        <NotebookPenIcon className="text-3xl" />
      </button>
    </ErrorBoundary>
  );
}
