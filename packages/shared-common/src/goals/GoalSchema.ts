import { z } from 'zod';

import { ColorSchema } from '../core/colors/ColorSchema';

export const GoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  order: z.number(),
  color: ColorSchema.nullable(),
  areasOfLife: z.array(z.string()),
  targetCompletedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

export const CreateGoalSchema = z.object({
  name: z
    .string({
      required_error: 'Please provide a name',
    })
    .min(1, {
      message: 'Name must be longer than 1 character',
    }),
  description: z.string().nullable().optional(),
  color: ColorSchema.nullable().optional(),
  areasOfLife: z.array(z.string()).optional(),
  targetCompletedAt: z.string().nullable().optional(),
});

export const UpdateGoalSchema = CreateGoalSchema.partial();

// Types
export type Goal = z.infer<typeof GoalSchema>;

export type CreateGoal = z.infer<typeof CreateGoalSchema>;

export type UpdateGoal = z.infer<typeof UpdateGoalSchema>;
