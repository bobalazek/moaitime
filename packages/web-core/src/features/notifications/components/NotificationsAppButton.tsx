import { BellIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';
import { useUserNotificationsStore } from '../state/userNotificationsStore';

export default function NotificationsAppButton() {
  const navigate = useNavigate();
  const { unreadUserNotificationsCount } = useUserNotificationsStore();

  return (
    <AppButton
      icon={BellIcon}
      onClick={() => {
        navigate('/notifications');
      }}
      title="Notifications"
      badgeCount={unreadUserNotificationsCount}
      style={{
        backgroundImage: 'radial-gradient(circle, #FF8585 0%, #D84315 100%)',
      }}
      data-test="notifications--open-button"
    />
  );
}
