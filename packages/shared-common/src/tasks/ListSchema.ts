import { z } from 'zod';

import { HexSchema } from '../core/HexSchema';

export const ListSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: HexSchema.nullable(),
  tasksCount: z.number().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateListSchema = z.object({
  name: z.string().min(1),
  color: HexSchema.nullable().optional(),
});

export const UpdateListSchema = CreateListSchema.partial();

// Types
export type List = z.infer<typeof ListSchema>;

export type CreateList = z.infer<typeof CreateListSchema>;

export type UpdateList = z.infer<typeof UpdateListSchema>;
