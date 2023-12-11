import { Label, Switch } from '@myzenbuddy/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import GreetingSettingsSectionHeaderText from './GreetingSettingsSectionHeaderText';

export default function GreetingSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const greetingEnabled = auth?.user?.settings?.greetingEnabled ?? false;

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <GreetingSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        Everybody likes to be greeted, so we of course also offer this feature!
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-greetingEnabled"
            checked={greetingEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                greetingEnabled: !greetingEnabled,
              });
            }}
          />
          <Label htmlFor="settings-greetingEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Should we show show you the greeting or not?</p>
      </div>
    </div>
  );
}
