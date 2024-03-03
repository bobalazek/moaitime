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
      data-test="habits--open-button"
    />
  );
}
