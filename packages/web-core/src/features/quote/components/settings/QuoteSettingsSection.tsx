import { Label, Switch } from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import QuoteSettingsSectionHeaderText from './QuoteSettingsSectionHeaderText';

export default function QuoteSettingsSection() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <QuoteSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        As they saying goes: A motivational quote per day keeps the doctor away!
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-quoteEnabled"
            checked={settings.quoteEnabled}
            onCheckedChange={() => {
              updateSettings({
                quoteEnabled: !settings.quoteEnabled,
              });
            }}
          />
          <Label htmlFor="settings-quoteEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want to keep the doctor away or not?</p>
      </div>
    </div>
  );
}
