import { SearchEnginesEnum } from '../search/SearchEnginesEnum';
import { SettingsInterface } from './SettingsInterface';

export const DEFAULT_SETTINGS: SettingsInterface = {
  generalTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  commandsEnabled: true,
  commandsSearchButtonEnabled: true,
  weatherEnabled: true,
  weatherUseMetricUnits: true,
  weatherLocation: '',
  weatherCoordinates: {
    latitude: 0,
    longitude: 0,
  },
  clockEnabled: true,
  clockUseDigitalClock: true,
  clockShowSeconds: true,
  clockUse24HourClock: !Intl.DateTimeFormat().resolvedOptions().hour12,
  searchEnabled: true,
  searchEngine: SearchEnginesEnum.GOOGLE,
  greetingEnabled: true,
  quoteEnabled: true,
  tasksEnabled: true,
  calendarEnabled: true,
  calendarStartDayOfWeek: 0,
};
