import { zonedTimeToUtc } from 'date-fns-tz';
import { z } from 'zod';

import { ColorSchema } from '../core/ColorSchema';
import { PermissionsSchema } from '../core/PermissionsSchema';
import { TimezoneSchema } from '../core/TimezoneSchema';

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  color: ColorSchema.nullable(),
  timezone: z.string().nullable(),
  endTimezone: z.string().nullable(),
  isAllDay: z.boolean(),
  startsAt: z.string(),
  endsAt: z.string(),
  deletedAt: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  calendarId: z.string(),
  userId: z.string(),
  permissions: PermissionsSchema.optional(),
});

export const CreateEventBaseSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  description: z.string().nullable().optional(),
  color: ColorSchema.nullable().optional(),
  timezone: TimezoneSchema.optional(),
  endTimezone: TimezoneSchema.optional(),
  isAllDay: z.boolean().optional(),
  startsAt: z.string({
    required_error: 'Start date is required',
  }),
  endsAt: z.string({
    required_error: 'End date is required',
  }),
  calendarId: z.string({ required_error: 'Calendar is required' }),
});

export const CreateEventSchema = CreateEventBaseSchema.refine(
  (data) => {
    const timezone = data.timezone ?? 'UTC';
    const endTimezone = data.endTimezone ?? timezone;

    const startsAt = zonedTimeToUtc(data.startsAt, timezone);
    const endsAt = zonedTimeToUtc(data.endsAt, endTimezone);

    const startTime = startsAt.getTime();
    const endTime = endsAt.getTime();

    if (data.isAllDay && startTime === endTime) {
      return true;
    }

    return startTime <= endTime;
  },
  {
    message: 'Start date must be before end date',
    path: ['startsAt', 'endsAt'],
  }
).refine(
  (data) => {
    if (!data.isAllDay) {
      return true;
    }

    return data.startsAt.endsWith('T00:00:00.000') && data.endsAt.endsWith('T00:00:00.000');
  },
  {
    message: 'All day events must start at T00:00:00.000Z and end at T00:00:00.000',
    path: ['isAllDay'],
  }
);

export const UpdateEventSchema = CreateEventBaseSchema.omit({
  timezone: true,
  endTimezone: true,
  isAllDay: true,
  calendarId: true,
});

// Types
export type Event = z.infer<typeof EventSchema>;

export type CreateEvent = z.infer<typeof CreateEventSchema>;

export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
