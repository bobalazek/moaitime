import { useAuthStore } from '../../../auth/state/authStore';
import TimezoneSelector from '../../../core/components/selectors/TimezoneSelector';
import GeneralSettingsSectionHeaderText from './GeneralSettingsSectionHeaderText';
import GeneralStartDayOfWeekSetting from './settings/GeneralStartDayOfWeekSetting';
import GeneralThemeSetting from './settings/GeneralThemeSetting';

export default function GeneralSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  return (
    <div>
      <h4 className="text-lg font-bold">
        <GeneralSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">Just the general stuff.</p>
      <div className="mb-4">
        <h4 className="mb-2 font-bold">Start day of week</h4>
        <div>
          <GeneralStartDayOfWeekSetting
            value={settings.generalStartDayOfWeek}
            onValueChange={(value) => {
              updateAccountSettings({
                generalStartDayOfWeek: value,
              });
            }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">What day should the week start?</p>
      </div>
      <div className="mb-4">
        <h4 className="mb-2 font-bold">Timezone</h4>
        <div>
          <TimezoneSelector
            value={settings.generalTimezone}
            onValueChange={(value) => {
              updateAccountSettings({
                generalTimezone: value ?? undefined,
              });
            }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">Which time zone are we at?</p>
      </div>
      <div className="mb-4">
        <h4 className="mb-2 font-bold">Theme</h4>
        <div>
          <GeneralThemeSetting
            value={settings.generalTheme}
            onValueChange={(value) => {
              updateAccountSettings({
                generalTheme: value,
              });
            }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">Fancy some colours? Or not. You decide.</p>
      </div>
    </div>
  );
}
