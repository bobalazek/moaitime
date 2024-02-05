import { useAuthStore } from '../../state/authStore';
import AccountSettingsAccountPasswordDialog from './AccountSettingsAccountPasswordDialog';
import AccountSettingsSectionContent from './AccountSettingsSectionContent';

export default function AccountSettingsSection() {
  const { auth } = useAuthStore();
  if (!auth) {
    return null;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-400">Who are you?</p>
      <AccountSettingsSectionContent />
      <AccountSettingsAccountPasswordDialog />
    </div>
  );
}
