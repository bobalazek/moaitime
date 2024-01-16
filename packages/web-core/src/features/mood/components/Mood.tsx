import { SmileIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';

export default function Mood() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <AppButton
        icon={SmileIcon}
        onClick={() => {
          navigate('/mood');
        }}
        title="Open mood"
        data-test="mood--open-button"
      />
    </ErrorBoundary>
  );
}
