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
      style={{
        backgroundImage: 'linear-gradient(180deg, #FFEB3B 0%, #FF9800 100%)',
      }}
      data-test="notes--open-button"
    />
  );
}
