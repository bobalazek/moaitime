import { ThemeEnum } from '../../core/ThemeEnum';
import { SearchEnginesEnum } from '../../search/SearchEnginesEnum';
import { UserSettings } from './UserSettingsSchema';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  // General
  generalTimezone: 'UTC',
  generalTheme: ThemeEnum.SYSTEM,
  generalStartDayOfWeek: 0,

  // Commands
  commandsEnabled: true,

  // Weather
  weatherEnabled: true,
  weatherUseMetricUnits: true,
  weatherLocation: '',
  weatherCoordinates: {
    latitude: 0,
    longitude: 0,
  },

  // Clock
  clockEnabled: true,
  clockUseDigitalClock: true,
  clockShowSeconds: true,
  clockUse24HourClock: true,

  // Search
  searchEnabled: true,
  searchEngine: SearchEnginesEnum.GOOGLE,

  // Greeting
  greetingEnabled: true,

  // Quote
  quoteEnabled: true,

  // Tasks
  tasksEnabled: true,
  tasksSoundsEnabled: true,

  // Notes
  notesEnabled: true,

  // Calendar
  calendarEnabled: true,
  calendarVisibleCalendarIds: ['*'],
  calendarVisibleListIds: ['*'],

  // Mood
  moodEnabled: true,
  moodSoundsEnabled: true,
  moodScores: {
    '-2': {
      label: 'terrible',
      color: '#EF4444',
    },
    '-1': {
      label: 'bad',
      color: '#F97316',
    },
    '0': {
      label: 'neutral',
      color: '#3B82F6',
    },
    '1': {
      label: 'good',
      color: '#84CC16',
    },
    '2': {
      label: 'great',
      color: '#10B981',
    },
  },

  // Focus
  focusEnabled: true,
  focusSoundsEnabled: true,
  focusSessionSettings: {
    focusDurationSeconds: 60 * 25,
    shortBreakDurationSeconds: 5 * 60,
    longBreakDurationSeconds: 15 * 60,
    focusRepetitionsCount: 4,
  },
};
