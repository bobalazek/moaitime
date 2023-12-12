import { z } from 'zod';

export const ListSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
  tasksCount: z.number().optional(),
  deletedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Types
export type List = z.infer<typeof ListSchema>;
