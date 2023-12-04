import { FaUserAlt } from 'react-icons/fa';

export default function AuthSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <FaUserAlt />
      <span>Account</span>
    </div>
  );
}
