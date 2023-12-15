import { z } from 'zod';

import { CalendarEntryTypeEnum } from './CalendarEntryTypeEnum';

export const CalendarEntrySchema = z.object({
  id: z.string(),
  type: z.nativeEnum(CalendarEntryTypeEnum),
  title: z.string(),
  description: z.string().nullable(),
  isAllDay: z.boolean(),
  calendarId: z.string().nullable(),
  startsAt: z.string(),
  endsAt: z.string(),
  deletedAt: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
});

export const CreateCalendarEntrySchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    isAllDay: z.boolean(),
    startsAt: z.string(),
    endsAt: z.string(),
  })
  .refine(
    (data) => {
      const startsAt = new Date(data.startsAt);
      const endsAt = new Date(data.endsAt);

      return startsAt < endsAt;
    },
    {
      message: 'Start date must be before end date',
      path: ['startsAt', 'endsAt'],
    }
  )
  .refine(
    (data) => {
      if (!data.isAllDay) {
        return true;
      }

      return data.startsAt.startsWith('T00:00:00.000Z') && data.endsAt.endsWith('T23:59:59.999Z');
    },
    {
      message: 'All day entries must start at T00:00:00.000Z and end at T23:59:59.999Z',
      path: ['isAllDay'],
    }
  );

// Types
export type CalendarEntry = z.infer<typeof CalendarEntrySchema>;

export type CreateCalendarEntry = z.infer<typeof CreateCalendarEntrySchema>;

export type CalendarEntryWithVerticalPosition = CalendarEntry & { left: number; width: number };
