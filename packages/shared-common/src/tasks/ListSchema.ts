import { z } from 'zod';

import { ColorSchema } from '../core/schemas/ColorSchema';

export const ListSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: ColorSchema.nullable(),
  tasksCount: z.number().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  teamId: z.string().nullable(),
});

export const CreateListSchema = z.object({
  name: z.string().min(1, {
    message: 'List name must be provided',
  }),
  color: ColorSchema.nullable().optional(),
  teamId: z.string().nullable().optional(),
});

export const UpdateListSchema = CreateListSchema.partial().omit({
  teamId: true,
});

// Types
export type List = z.infer<typeof ListSchema>;

export type CreateList = z.infer<typeof CreateListSchema>;

export type UpdateList = z.infer<typeof UpdateListSchema>;
