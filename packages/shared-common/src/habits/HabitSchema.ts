import { z } from 'zod';

import { ColorSchema } from '../core/colors/ColorSchema';
import { HabitGoalFrequencyEnum } from './HabitGoalFrequencyEnum';

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  color: z.string().nullable(),
  description: z.string().nullable(),
  priority: z.number().nullable(),
  goalAmount: z.number(),
  goalUnit: z.string(),
  goalFrequency: z.nativeEnum(HabitGoalFrequencyEnum),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

export const CreateHabitSchema = z.object({
  name: z
    .string({
      required_error: 'Habit name must be provided',
    })
    .min(1, {
      message: 'Habit name must be longer than 1 character',
    }),
  color: ColorSchema.nullable().optional(),
  priority: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  goalAmount: z
    .number({
      required_error: 'Goal amount must be provided',
    })
    .min(1, {
      message: 'Goal amount must be greater than 0',
    }),
  goalUnit: z
    .string({
      required_error: 'Goal unit must be provided',
    })
    .min(1, {
      message: 'Goal unit must be provided',
    }),
  goalFrequency: z.nativeEnum(HabitGoalFrequencyEnum, {
    required_error: 'Goal frequency must be provided',
  }),
});

export const UpdateHabitSchema = CreateHabitSchema.partial();

// Types
export type Habit = z.infer<typeof HabitSchema>;

export type CreateHabit = z.infer<typeof CreateHabitSchema>;

export type UpdateHabit = z.infer<typeof UpdateHabitSchema>;
