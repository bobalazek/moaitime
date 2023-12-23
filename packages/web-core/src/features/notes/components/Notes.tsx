import { FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';

export default function Notes() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <button
        className="text-xl text-white transition-all"
        data-test="notes--open-button"
        onClick={() => {
          navigate('/notes');
        }}
      >
        <FaBook className="text-3xl" />
      </button>
    </ErrorBoundary>
  );
}
