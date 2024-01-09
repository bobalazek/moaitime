import { SmileIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';

export default function Mood() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <button
        className="text-xl text-white transition-all"
        onClick={() => {
          navigate('/mood');
        }}
        title="Open mood"
        data-test="mood--open-button"
      >
        <SmileIcon className="text-3xl" />
      </button>
    </ErrorBoundary>
  );
}
