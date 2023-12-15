import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  isAllDay: z.boolean(),
  startsAt: z.string(),
  endsAt: z.string(),
  deletedAt: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
});

export const CreateEventSchema = z
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
      message: 'All day events must start at T00:00:00.000Z and end at T23:59:59.999Z',
      path: ['isAllDay'],
    }
  );

// Types
export type Event = z.infer<typeof EventSchema>;

export type CreateEvent = z.infer<typeof CreateEventSchema>;
