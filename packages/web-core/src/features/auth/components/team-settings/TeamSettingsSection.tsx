import { useAuthStore } from '../../state/authStore';
import TeamSettingsSectionContent from './TeamSettingsSectionContent';
import TeamSettingsSectionHeaderText from './TeamSettingsSectionHeaderText';

export default function TeamSettingsSection() {
  const { auth } = useAuthStore();
  if (!auth) {
    return null;
  }

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <TeamSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">Who will be collborating with?</p>
      <TeamSettingsSectionContent />
    </div>
  );
}
