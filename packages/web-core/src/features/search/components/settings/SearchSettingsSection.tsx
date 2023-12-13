import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import SearchSettingsSectionHeaderText from './SearchSettingsSectionHeaderText';

export default function SearchSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const searchEnabled = auth?.user?.settings?.searchEnabled ?? false;

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <SearchSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        We all love to search for things, so we did our best to make it as easy as possible for you!
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-searchEnabled"
            checked={searchEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                searchEnabled: !searchEnabled,
              });
            }}
          />
          <Label htmlFor="settings-searchEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Should we show show you the search bar?</p>
      </div>
    </div>
  );
}
