import { Alert, AlertDescription, AlertTitle } from '@moaitime/web-ui';

import { useAuthStore } from '../../state/authStore';
import AuthSettingsAccountPasswordDialog from './AuthSettingsAccountPasswordDialog';
import AuthSettingsSectionContent from './AuthSettingsSectionContent';
import AuthSettingsSectionHeaderText from './AuthSettingsSectionHeaderText';

export default function AuthSettingsSection() {
  const { auth } = useAuthStore();

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <AuthSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">Who are you?</p>
      {!auth && (
        <Alert>
          <AlertTitle>Not logged in</AlertTitle>
          <AlertDescription className="mb-4">
            At the moment it seems that you are not yet logged in, which is a bummer, because our
            app really shines once you connect to your account!
          </AlertDescription>
        </Alert>
      )}
      {auth && <AuthSettingsSectionContent auth={auth} />}
      <AuthSettingsAccountPasswordDialog />
    </div>
  );
}
