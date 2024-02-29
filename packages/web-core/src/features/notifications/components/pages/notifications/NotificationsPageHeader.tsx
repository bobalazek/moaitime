import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import UserProfileDropdown from '../../../../social/components/pages/layout/UserProfileDropdown';

const NotificationsPageHeader = () => {
  return (
    <LayoutPageHeader testKey="notifications" title="Notifications">
      <UserProfileDropdown />
    </LayoutPageHeader>
  );
};

export default NotificationsPageHeader;
