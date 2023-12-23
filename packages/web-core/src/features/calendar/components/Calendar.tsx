import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';

export default function Calendar() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <button
        className="text-xl text-white transition-all"
        data-test="calendar--dialog--trigger-button"
        onClick={() => {
          navigate('/calendar');
        }}
      >
        <FaCalendarAlt className="text-3xl" />
      </button>
    </ErrorBoundary>
  );
}
