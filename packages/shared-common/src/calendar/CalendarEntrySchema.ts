import { z } from 'zod';

import { ColorSchema } from '../core/colors/ColorSchema';
import { PermissionsSchema } from '../core/PermissionsSchema';
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
  permissions: PermissionsSchema.optional(),
  raw: EventSchema.or(TaskSchema).optional(),
});

// Types
export type CalendarEntry = z.infer<typeof CalendarEntrySchema>;

export type CalendarEntryWithVerticalPosition = CalendarEntry & { left: string; width: string };

export type CalendarEntryWithPosition = CalendarEntryWithVerticalPosition & {
  top: string;
  height: string;
};

export type CalendarEntryYearlyEntry = {
  date: string;
  count: number;
};

export type CalendarEntriesPerDay = {
  withouFullDay: CalendarEntryWithVerticalPosition[];
  fullDayOnly: CalendarEntryWithVerticalPosition[];
};
