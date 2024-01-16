import { NotebookPenIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';

export default function Notes() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <AppButton
        icon={NotebookPenIcon}
        onClick={() => {
          navigate('/notes');
        }}
        title="Open notes"
        data-test="notes--open-button"
      />
    </ErrorBoundary>
  );
}
