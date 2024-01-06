import { z } from 'zod';

import { ColorSchema } from '../core/ColorSchema';
import { TaskSchema } from '../tasks/TaskSchema';
import { CalendarEntryTypeEnum } from './CalendarEntryTypeEnum';
import { EventSchema } from './EventSchema';

export const CalendarEntrySchema = z.object({
  id: z.string(),
  type: z.nativeEnum(CalendarEntryTypeEnum),
  title: z.string(),
  description: z.string().nullable(),
  color: ColorSchema.nullable(),
  isAllDay: z.boolean(),
  timezone: z.string(),
  startsAt: z.string(),
  startsAtUtc: z.string(),
  endsAt: z.string(),
  endsAtUtc: z.string(),
  endTimezone: z.string().nullable(),
  calendarId: z.string().nullable(),
  isEditable: z.boolean().optional(),
  isDeletable: z.boolean().optional(),
  raw: EventSchema.or(TaskSchema).optional(),
});

export const CreateCalendarEntrySchema = z.object({
  type: z.nativeEnum(CalendarEntryTypeEnum),
  title: z.string(),
  description: z.string().optional(),
  color: ColorSchema.nullable().optional(),
  timezone: z.string().optional(),
  endTimezone: z.string().optional(),
  isAllDay: z.boolean(),
  startsAt: z.string(),
  endsAt: z.string(),
  calendarId: z.string(),
});

export const UpdateCalendarEntrySchema = CreateCalendarEntrySchema.partial().omit({
  type: true,
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

export type CalendarEntryYearlyEntry = {
  date: string;
  count: number;
};
