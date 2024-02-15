import { LockIcon } from 'lucide-react';

export default function PrivacySettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <LockIcon />
      <span>Privacy</span>
    </div>
  );
}
