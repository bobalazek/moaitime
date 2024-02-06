import { BellIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../../core/components/AppButton';

export default function NotificationsAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={BellIcon}
      onClick={() => {
        navigate('/notifications');
      }}
      title="Notifications"
      data-test="notifications--open-button"
    />
  );
}
