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
      title="Mood"
      style={{
        backgroundImage: 'radial-gradient(circle, #AED581 0%, #689F38 100%)',
      }}
      data-test="mood--open-button"
    />
  );
}
