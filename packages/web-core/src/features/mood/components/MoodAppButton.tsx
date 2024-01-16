import { SmileIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';

export default function MoodAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={SmileIcon}
      onClick={() => {
        navigate('/mood');
      }}
      title="Mood Tracker"
      data-test="mood--open-button"
    />
  );
}
