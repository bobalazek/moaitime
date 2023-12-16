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
  calendarId: z.string(),
});

export const CreateCalendarEntrySchema = z.object({
  type: z.nativeEnum(CalendarEntryTypeEnum),
  title: z.string(),
  description: z.string().nullable(),
  timezone: z.string(),
  endTimezone: z.string().nullable(),
  isAllDay: z.boolean(),
  startsAt: z.string(),
  endsAt: z.string(),
  calendarId: z.string(),
});

export const UpdateCalendarEntrySchema = CreateCalendarEntrySchema.partial().omit({
  type: true,
  calendarId: true,
});

// Types
export type CalendarEntry = z.infer<typeof CalendarEntrySchema>;

export type CreateCalendarEntry = z.infer<typeof CreateCalendarEntrySchema>;

export type UpdateCalendarEntry = z.infer<typeof UpdateCalendarEntrySchema>;

export type CalendarEntryWithVerticalPosition = CalendarEntry & { left: string; width: string };

export type CalendarEntryWithPosition = CalendarEntryWithVerticalPosition & {
  top: string;
  height: string;
};
