import { zonedTimeToUtc } from 'date-fns-tz';
import { z } from 'zod';

import { ColorSchema } from '../core/colors/ColorSchema';
import { RepeatPatternSchema } from '../core/dates/RepeatPatternSchema';
import { TimezoneSchema } from '../core/dates/TimezoneSchema';
import { PermissionsSchema } from '../core/PermissionsSchema';

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  color: ColorSchema.nullable(),
  timezone: z.string().nullable(),
  endTimezone: z.string().nullable(),
  isAllDay: z.boolean(),
  repeatPattern: z.string().nullable(),
  repeatEndsAt: z.string().nullable(),
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
  timezone: TimezoneSchema.nullable().optional(),
  endTimezone: TimezoneSchema.nullable().optional(),
  isAllDay: z.boolean().optional(),
  repeatPattern: RepeatPatternSchema.nullable().optional(),
  repeatEndsAt: z.string().nullable().optional(),
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

    if (startTime >= endTime) {
      return false;
    }

    const durationSeconds = (endTime - startTime) / 1000;
    if (durationSeconds < 60) {
      return false;
    }

    return true;
  },
  {
    message: 'Start date must be before end date and at least 1 minutes long',
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
}).partial();

// Types
export type Event = z.infer<typeof EventSchema>;

export type CreateEvent = z.infer<typeof CreateEventSchema>;

export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
