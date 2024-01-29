import { UserIcon } from 'lucide-react';

export default function AccountSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <UserIcon />
      <span>Account</span>
    </div>
  );
}
