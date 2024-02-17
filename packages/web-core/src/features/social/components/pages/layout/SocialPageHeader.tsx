import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import UserProfileDropdown from './UserProfileDropdown';

const SocialPageHeader = () => {
  return (
    <LayoutPageHeader testKey="social" title="Social">
      <UserProfileDropdown />
    </LayoutPageHeader>
  );
};

export default SocialPageHeader;
