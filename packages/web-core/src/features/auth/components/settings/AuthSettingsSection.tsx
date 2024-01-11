import { useAuthStore } from '../../state/authStore';
import AuthSettingsAccountPasswordDialog from './AuthSettingsAccountPasswordDialog';
import AuthSettingsSectionContent from './AuthSettingsSectionContent';
import AuthSettingsSectionHeaderText from './AuthSettingsSectionHeaderText';

export default function AuthSettingsSection() {
  const { auth } = useAuthStore();
  if (!auth) {
    return null;
  }

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <AuthSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">Who are you?</p>
      <AuthSettingsSectionContent />
      <AuthSettingsAccountPasswordDialog />
    </div>
  );
}
