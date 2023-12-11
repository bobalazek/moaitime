import { z } from 'zod';

import { CalendarDayOfWeek } from '../calendar/CalendarDayOfWeek';
import { SearchEnginesEnum } from '../search/SearchEnginesEnum';

export const SettingsSchema = z.object({
  // General
  generalTimezone: z.string(),

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

  // Calendar
  calendarEnabled: z.boolean(),
  calendarStartDayOfWeek: z.number().min(0).max(6) as z.ZodType<CalendarDayOfWeek>,
});

export type SettingsInterface = z.infer<typeof SettingsSchema>;
