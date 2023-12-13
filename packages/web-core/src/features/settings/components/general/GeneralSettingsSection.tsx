import { DayOfWeek, getTimezones } from '@moaitime/shared-common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import GeneralSettingsSectionHeaderText from './GeneralSettingsSectionHeaderText';

const startDayOfWeekOptions = [
  {
    label: 'Sunday',
    value: 0,
  },
  {
    label: 'Monday',
    value: 1,
  },
  {
    label: 'Tuesday',
    value: 2,
  },
  {
    label: 'Wednesday',
    value: 3,
  },
  {
    label: 'Thursday',
    value: 4,
  },
  {
    label: 'Friday',
    value: 5,
  },
  {
    label: 'Saturday',
    value: 6,
  },
];

const timezones = getTimezones();

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
          <Select
            value={settings.generalStartDayOfWeek.toString()}
            onValueChange={(value) => {
              updateAccountSettings({
                generalStartDayOfWeek: parseInt(value) as DayOfWeek,
              });
            }}
          >
            <SelectTrigger className="w-full" id="settings-generalStartDayOfWeek">
              <SelectValue placeholder="Start day of week" />
            </SelectTrigger>
            <SelectContent data-test="general--settings--startDayOfWeek">
              {startDayOfWeekOptions.map(({ label, value }) => (
                <SelectItem key={value} value={value.toString()}>
                  <span className="inline-block">{label}</span>
                  <span className="ml-2 inline-block h-2 w-2 rounded-full"></span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="mt-2 text-xs text-gray-400">What day should the week start?</p>
      </div>
      <div className="mb-4">
        <h4 className="mb-2 font-bold">Timezone</h4>
        <div>
          <Select
            value={settings.generalTimezone}
            onValueChange={(value) => {
              updateAccountSettings({
                generalTimezone: value,
              });
            }}
          >
            <SelectTrigger className="w-full" id="settings-generalTimezone">
              <SelectValue placeholder="Start day of week" />
            </SelectTrigger>
            <SelectContent data-test="general--settings--timezone" className="max-h-64">
              {timezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>
                  <span className="inline-block">{timezone}</span>
                  <span className="ml-2 inline-block h-2 w-2 rounded-full"></span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="mt-2 text-xs text-gray-400">Which time zone are we at?</p>
      </div>
    </div>
  );
}
