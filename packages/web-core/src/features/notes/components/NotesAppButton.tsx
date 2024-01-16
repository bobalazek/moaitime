import { NotebookPenIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';

export default function NotesAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={NotebookPenIcon}
      onClick={() => {
        navigate('/notes');
      }}
      title="Notes"
      data-test="notes--open-button"
    />
  );
}
