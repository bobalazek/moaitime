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
      title="Calendar"
      style={{
        backgroundImage: 'linear-gradient(180deg, #FF9E80 0%, #FF6E40 100%)',
      }}
      data-test="calendar--open-button"
    />
  );
}
