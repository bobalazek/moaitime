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
      <AccountSettingsSectionContent />
      <AccountSettingsAccountPasswordDialog />
    </div>
  );
}
