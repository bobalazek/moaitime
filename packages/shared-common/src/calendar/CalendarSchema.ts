import { z } from 'zod';

export const CalendarSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  timezone: z.string().nullable(),
  isPublic: z.boolean(),
  deletedAt: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  userId: z.string(),
});

export const CreateCalendarSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  description: z.string().optional(),
  timezone: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const UpdateCalendarSchema = CreateCalendarSchema.partial();

// Types
export type Calendar = z.infer<typeof CalendarSchema>;

export type CreateCalendar = z.infer<typeof CreateCalendarSchema>;

export type UpdateCalendar = z.infer<typeof UpdateCalendarSchema>;
