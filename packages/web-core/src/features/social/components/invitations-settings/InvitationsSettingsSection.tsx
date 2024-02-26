import { useAuthStore } from '../../../auth/state/authStore';
import InvitationsSettingsSectionContent from './InvitationsSettingsSectionContent';

export default function InvitationsSettingsSection() {
  const { auth } = useAuthStore();
  if (!auth) {
    return null;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-400">
        Want to invite any mates? Here's the right place to do so!
      </p>
      <InvitationsSettingsSectionContent />
    </div>
  );
}
