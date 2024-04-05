import { RepeatIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';

export default function HabitsAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={RepeatIcon}
      onClick={() => {
        navigate('/habits');
      }}
      title="Habits"
      style={{
        backgroundImage: 'radial-gradient(circle, #C5A3FF 0%, #9C27B0 100%)',
      }}
      data-test="habits--open-button"
    />
  );
}
