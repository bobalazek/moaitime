import { CalendarDayOfWeek } from '../calendar/CalendarDayOfWeek';
import { SearchEnginesEnum } from '../search/SearchEnginesEnum';

export interface SettingsInterface {
  // General
  generalTimezone: string;

  // Commands
  commandsEnabled: boolean;
  commandsSearchButtonEnabled: boolean;

  // Weather
  weatherEnabled: boolean;
  weatherUseMetricUnits: boolean;
  weatherLocation: string;
  weatherCoordinates: {
    latitude: number;
    longitude: number;
  };

  // Clock
  clockEnabled: boolean;
  clockUseDigitalClock: boolean;
  clockShowSeconds: boolean;
  clockUse24HourClock: boolean;

  // Search
  searchEnabled: boolean;
  searchEngine: SearchEnginesEnum;

  // Greeting
  greetingEnabled: boolean;

  // Quote
  quoteEnabled: boolean;

  // Tasks
  tasksEnabled: boolean;

  // Calendar
  calendarEnabled: boolean;
  calendarStartDayOfWeek: CalendarDayOfWeek;
}
