import { z } from 'zod';

export const ListSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().nullable(),
  tasksCount: z.number().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Types
export type List = z.infer<typeof ListSchema>;
