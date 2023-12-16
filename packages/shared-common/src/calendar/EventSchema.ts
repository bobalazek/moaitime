import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  timezone: z.string().nullable(),
  endTimezone: z.string().nullable(),
  isAllDay: z.boolean(),
  startsAt: z.string(),
  endsAt: z.string(),
  deletedAt: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  calendarId: z.string(),
});

export const CreateEventBaseSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  description: z.string().optional(),
  timezone: z.string().optional(),
  endTimezone: z.string().optional(),
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
    const startsAt = new Date(data.startsAt);
    const endsAt = new Date(data.endsAt);

    return startsAt < endsAt;
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

    return data.startsAt.endsWith('T00:00:00.000Z') && data.endsAt.endsWith('T23:59:59.999Z');
  },
  {
    message: 'All day events must start at T00:00:00.000Z and end at T23:59:59.999Z',
    path: ['isAllDay'],
  }
);

export const UpdateEventSchema = CreateEventBaseSchema.partial();

// Types
export type Event = z.infer<typeof EventSchema>;

export type CreateEvent = z.infer<typeof CreateEventSchema>;

export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
