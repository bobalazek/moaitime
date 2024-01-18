import { z } from 'zod';

import { ColorSchema } from '../core/ColorSchema';
import { PermissionsSchema } from '../core/PermissionsSchema';

// Calendar
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
  permissions: PermissionsSchema.extend({
    canAddSharedCalendar: z.boolean().optional(),
    canUpdateSharedCalendar: z.boolean().optional(),
  }).optional(),
});

export const CreateCalendarSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  description: z.string().nullable().optional(),
  color: ColorSchema.optional(),
  timezone: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const UpdateCalendarSchema = CreateCalendarSchema.partial();

// User Calendar
export const UserCalendarSchema = z.object({
  id: z.string(),
  userId: z.string(),
  calendarId: z.string(),
  color: ColorSchema.nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
});

export const UpdateUserCalendarSchema = z.object({
  color: ColorSchema.nullable().optional(),
});

// Types
export type Calendar = z.infer<typeof CalendarSchema>;

export type CreateCalendar = z.infer<typeof CreateCalendarSchema>;

export type UpdateCalendar = z.infer<typeof UpdateCalendarSchema>;

// User Calendar
export type UserCalendar = z.infer<typeof UserCalendarSchema>;

export type UpdateUserCalendar = z.infer<typeof UpdateUserCalendarSchema>;
