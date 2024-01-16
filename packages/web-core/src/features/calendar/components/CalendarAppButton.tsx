import { CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';

export default function CalendarAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={CalendarIcon}
      onClick={() => {
        navigate('/calendar');
      }}
      title="Open calendar"
      data-test="calendar--open-button"
    />
  );
}
