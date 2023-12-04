import { Label, Switch } from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import GreetingSettingsSectionHeaderText from './GreetingSettingsSectionHeaderText';

export default function GreetingSettingsSection() {
  const { settings, updateSettings } = useSettingsStore();

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
            checked={settings.greetingEnabled}
            onCheckedChange={() => {
              updateSettings({
                greetingEnabled: !settings.greetingEnabled,
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
