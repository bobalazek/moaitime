import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  description: z.string().nullable(),
  priority: z.number().nullable(),
  dueDate: z.string().nullable(),
  dueDateTime: z.string().nullable(),
  dueDateTimeZone: z.string().nullable(),
  completedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  listId: z.string(),
});

export const CreateTaskSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Task name must be provided',
    })
    .optional(),
  description: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  dueDateTime: z.string().nullable().optional(),
  dueDateTimeZone: z.string().nullable().optional(),
  listId: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema;

// Types
export type Task = z.infer<typeof TaskSchema>;

export type CreateTask = z.infer<typeof CreateTaskSchema>;

export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
