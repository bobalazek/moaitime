import { NewspaperIcon, UserSearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import UserProfileDropdown from './UserProfileDropdown';

const SocialPageHeader = () => {
  return (
    <LayoutPageHeader testKey="social" title="Social">
      <div className="flex items-center gap-6">
        <Link to="/social">
          <NewspaperIcon size={24} />
        </Link>
        <Link to="/social/user-search">
          <UserSearchIcon size={24} />
        </Link>
        <UserProfileDropdown />
      </div>
    </LayoutPageHeader>
  );
};

export default SocialPageHeader;
