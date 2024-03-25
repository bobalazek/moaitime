import { useAuthStore } from '../../../auth/state/authStore';
import TeamSettingsSectionContent from './TeamSettingsSectionContent';

export default function TeamSettingsSection() {
  const { auth } = useAuthStore();
  if (!auth) {
    return null;
  }

  return (
    <div>
      <TeamSettingsSectionContent />
    </div>
  );
}
