import { MailPlusIcon } from 'lucide-react';

export default function InvitationsSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <MailPlusIcon />
      <span>Invitations</span>
    </div>
  );
}
