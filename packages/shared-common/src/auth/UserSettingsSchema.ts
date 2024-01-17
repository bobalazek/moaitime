import { z } from 'zod';

import { DayOfWeek } from '../core/DayOfWeek';
import { ThemeEnum } from '../core/ThemeEnum';
import { SearchEnginesEnum } from '../search/SearchEnginesEnum';

export const UserSettingsSchema = z.object({
  // General
  generalTimezone: z.string(),
  generalStartDayOfWeek: z.number().min(0).max(6) as z.ZodType<DayOfWeek>,
  generalTheme: z.nativeEnum(ThemeEnum),

  // Commands
  commandsEnabled: z.boolean(),
  commandsSearchButtonEnabled: z.boolean(),

  // Weather
  weatherEnabled: z.boolean(),
  weatherUseMetricUnits: z.boolean(),
  weatherLocation: z.string(),
  weatherCoordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),

  // Clock
  clockEnabled: z.boolean(),
  clockUseDigitalClock: z.boolean(),
  clockShowSeconds: z.boolean(),
  clockUse24HourClock: z.boolean(),

  // Search
  searchEnabled: z.boolean(),
  searchEngine: z.nativeEnum(SearchEnginesEnum),

  // Greeting
  greetingEnabled: z.boolean(),

  // Quote
  quoteEnabled: z.boolean(),

  // Tasks
  tasksEnabled: z.boolean(),

  // Notes
  notesEnabled: z.boolean(),

  // Calendar
  calendarEnabled: z.boolean(),
  calendarVisibleCalendarIds: z.array(z.string()),
  calendarVisibleListIds: z.array(z.string()),

  // Mood
  moodEnabled: z.boolean(),
});

export const UpdateUserSettingsSchema = UserSettingsSchema.partial();

// Types
export type UserSettings = z.infer<typeof UserSettingsSchema>;

export type UpdateUserSettings = z.infer<typeof UpdateUserSettingsSchema>;
