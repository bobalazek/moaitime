import { useAuthStore } from '../../state/authStore';
import AccountSettingsAccountPasswordDialog from './AccountSettingsAccountPasswordDialog';
import AccountSettingsSectionContent from './AccountSettingsSectionContent';
import AccountSettingsSectionHeaderText from './AccountSettingsSectionHeaderText';

export default function AccountSettingsSection() {
  const { auth } = useAuthStore();
  if (!auth) {
    return null;
  }

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <AccountSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">Who are you?</p>
      <AccountSettingsSectionContent />
      <AccountSettingsAccountPasswordDialog />
    </div>
  );
}
