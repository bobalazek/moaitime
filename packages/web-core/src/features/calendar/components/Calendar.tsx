import { CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';

export default function Calendar() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <button
        className="text-xl text-white transition-all"
        onClick={() => {
          navigate('/calendar');
        }}
        title="Open calendar"
        data-test="calendar--open-button"
      >
        <CalendarIcon className="text-3xl" />
      </button>
    </ErrorBoundary>
  );
}
