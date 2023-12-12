import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  description: z.string().optional(),
  priority: z.number().optional(),
  dueAt: z.string().optional(),
  completedAt: z.string().optional(),
  deletedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  listId: z.string().optional(),
});

// Types
export type Task = z.infer<typeof TaskSchema>;
