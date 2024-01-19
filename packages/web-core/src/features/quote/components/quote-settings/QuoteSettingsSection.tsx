import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';
import QuoteSettingsSectionHeaderText from './QuoteSettingsSectionHeaderText';

export default function QuoteSettingsSection() {
  const { updateAccountSettings } = useAuthStore();

  const quoteEnabled = useAuthUserSetting('quoteEnabled', false);

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
            checked={quoteEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                quoteEnabled: !quoteEnabled,
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
