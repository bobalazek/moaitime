import { CalendarDayOfWeek } from '@myzenbuddy/shared-common';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import CalendarSettingsSectionHeaderText from './CalendarSettingsSectionHeaderText';

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

export default function CalendarSettingsSection() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div>
      <h4 className="text-lg font-bold">
        <CalendarSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">Just some visual squares to show you what day it is.</p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-calendarEnabled"
            checked={settings.calendarEnabled}
            onCheckedChange={() => {
              updateSettings({
                calendarEnabled: !settings.calendarEnabled,
              });
            }}
          />
          <Label htmlFor="settings-calendarEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want to have the calendar on not?</p>
      </div>
      {settings.calendarEnabled && (
        <div className="mb-4">
          <h4 className="mb-2 font-bold">Start day of week</h4>
          <div>
            <Select
              value={settings.calendarStartDayOfWeek.toString()}
              onValueChange={(value) => {
                updateSettings({
                  calendarStartDayOfWeek: parseInt(value) as CalendarDayOfWeek,
                });
              }}
            >
              <SelectTrigger className="w-full" id="settings-calendarStartDayOfWeek">
                <SelectValue placeholder="Start day of week" />
              </SelectTrigger>
              <SelectContent data-test="calendar--settings--startDayOfWeek">
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
      )}
    </div>
  );
}
