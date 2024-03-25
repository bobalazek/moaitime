import { useAuthStore } from '../../../auth/state/authStore';
import InvitationsSettingsSectionContent from './InvitationsSettingsSectionContent';

export default function InvitationsSettingsSection() {
  const { auth } = useAuthStore();
  if (!auth) {
    return null;
  }

  return (
    <div>
      <InvitationsSettingsSectionContent />
    </div>
  );
}
