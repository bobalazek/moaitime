import { SearchEnginesEnum } from '../search/SearchEnginesEnum';
import { UserSettings } from './UserSettingsSchema';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  generalTimezone: 'UTC',
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
  clockUse24HourClock: true,
  searchEnabled: true,
  searchEngine: SearchEnginesEnum.GOOGLE,
  greetingEnabled: true,
  quoteEnabled: true,
  tasksEnabled: true,
  calendarEnabled: true,
  calendarStartDayOfWeek: 0,
};
