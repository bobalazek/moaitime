import { z } from 'zod';

import { CalendarEntryTypeEnum } from './CalendarEntryTypeEnum';

export const CalendarEntrySchema = z.object({
  id: z.string(),
  type: z.nativeEnum(CalendarEntryTypeEnum),
  title: z.string(),
  description: z.string().nullable(),
  timezone: z.string(),
  endTimezone: z.string().nullable(),
  isAllDay: z.boolean(),
  startsAt: z.string(),
  endsAt: z.string(),
  deletedAt: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  calendarId: z.string().nullable(),
});

export const UpdateCalendarEntrySchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  timezone: z.string().optional(),
  endTimezone: z.string().nullable().optional(),
  isAllDay: z.boolean().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  calendarId: z.string().nullable().optional(),
});

// Types
export type CalendarEntry = z.infer<typeof CalendarEntrySchema>;

export type UpdateCalendarEntry = z.infer<typeof UpdateCalendarEntrySchema>;

export type CalendarEntryWithVerticalPosition = CalendarEntry & { left: string; width: string };

export type CalendarEntryWithPosition = CalendarEntryWithVerticalPosition & {
  top: string;
  height: string;
};
