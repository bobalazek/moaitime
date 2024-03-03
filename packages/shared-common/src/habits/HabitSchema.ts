import { z } from 'zod';

import { ColorSchema } from '../core/colors/ColorSchema';

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  color: z.string().nullable(),
  description: z.string().nullable(),
  priority: z.number().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

export const CreateHabitSchema = z.object({
  name: z.string().min(1, {
    message: 'Habit name must be provided',
  }),
  color: ColorSchema.nullable().optional(),
  priority: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const UpdateHabitSchema = CreateHabitSchema;

// Types
export type Habit = z.infer<typeof HabitSchema>;

export type CreateHabit = z.infer<typeof CreateHabitSchema>;

export type UpdateHabit = z.infer<typeof UpdateHabitSchema>;
