import { CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';

export default function Calendar() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <AppButton
        icon={CalendarIcon}
        onClick={() => {
          navigate('/calendar');
        }}
        title="Open calendar"
        data-test="calendar--open-button"
      />
    </ErrorBoundary>
  );
}
