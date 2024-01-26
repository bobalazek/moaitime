import { z } from 'zod';

import { MOOD_SCORES } from '../Constants';
import { DayOfWeek } from '../core/DayOfWeek';
import { HexColorSchema } from '../core/HexColorSchema';
import { ThemeEnum } from '../core/ThemeEnum';
import { FocusSessionSettingsSchema } from '../focus/FocusSessionSchema';
import { SearchEnginesEnum } from '../search/SearchEnginesEnum';

export const UserSettingsSchema = z.object({
  // General
  generalTimezone: z.string(),
  generalStartDayOfWeek: z.number().min(0).max(6) as z.ZodType<DayOfWeek>,
  generalTheme: z.nativeEnum(ThemeEnum),

  // Commands
  commandsEnabled: z.boolean(),

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
  tasksSoundsEnabled: z.boolean(),

  // Notes
  notesEnabled: z.boolean(),

  // Calendar
  calendarEnabled: z.boolean(),
  calendarVisibleCalendarIds: z.array(z.string()),
  calendarVisibleListIds: z.array(z.string()),

  // Mood
  moodEnabled: z.boolean(),
  moodSoundsEnabled: z.boolean(),
  moodScores: z
    .record(
      z.object({
        label: z
          .string({ required_error: 'Label is required' })
          .min(1, {
            message: 'Label must be 1 character or more',
          })
          .max(16, {
            message: 'Label must be 16 characters or less',
          }),
        color: HexColorSchema,
      })
    )
    .refine((scores) => {
      const scoreKeys = Object.keys(scores).map((key) => parseInt(key, 10));

      return scoreKeys.length === 5 && scoreKeys.every((score) => MOOD_SCORES.includes(score));
    }),

  // Focus
  focusEnabled: z.boolean(),
  focusSoundsEnabled: z.boolean(),
  focusSessionSettings: FocusSessionSettingsSchema,
});

export const UpdateUserSettingsSchema = UserSettingsSchema.partial();

// Types
export type UserSettings = z.infer<typeof UserSettingsSchema>;

export type UpdateUserSettings = z.infer<typeof UpdateUserSettingsSchema>;
