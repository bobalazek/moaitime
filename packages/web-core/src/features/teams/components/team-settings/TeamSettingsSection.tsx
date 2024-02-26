import { useAuthStore } from '../../../auth/state/authStore';
import TeamSettingsSectionContent from './TeamSettingsSectionContent';

export default function TeamSettingsSection() {
  const { auth } = useAuthStore();
  if (!auth) {
    return null;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-400">Who will be collborating with?</p>
      <TeamSettingsSectionContent />
    </div>
  );
}
