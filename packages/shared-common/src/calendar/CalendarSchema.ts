import { z } from 'zod';

import { ColorSchema } from '../core/ColorSchema';

export const CalendarSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: ColorSchema.nullable(),
  description: z.string().nullable(),
  timezone: z.string().nullable(),
  isPublic: z.boolean(),
  deletedAt: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  userId: z.string(),
  isEditable: z.boolean().optional(),
  isDeletable: z.boolean().optional(),
});

export const CreateCalendarSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  description: z.string().optional(),
  color: ColorSchema.optional(),
  timezone: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const UpdateCalendarSchema = CreateCalendarSchema.partial();

// Types
export type Calendar = z.infer<typeof CalendarSchema>;

export type CreateCalendar = z.infer<typeof CreateCalendarSchema>;

export type UpdateCalendar = z.infer<typeof UpdateCalendarSchema>;
