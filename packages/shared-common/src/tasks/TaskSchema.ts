import { z } from 'zod';

import { ColorSchema } from '../core/ColorSchema';
import { TimezoneSchema } from '../core/TimezoneSchema';
import { isValidTime } from '../Helpers';

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  color: z.string().nullable(),
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
  name: z.string().min(1, {
    message: 'Task name must be provided',
  }),
  color: ColorSchema.nullable().optional(),
  description: z.string().nullable().optional(),
  dueDate: z
    .string()
    .refine(
      (data) => {
        if (!data) {
          return true;
        }

        const now = new Date();
        let dueDate = new Date(data);

        if (data.length === 10) {
          dueDate = new Date(`${data}T00:00:00.000`);
        }

        return dueDate >= now;
      },
      {
        message: 'Due date must be in the future',
      }
    )
    .nullable()
    .optional(),
  dueDateTime: z
    .string()
    .refine(
      (data) => {
        if (!data) {
          return true;
        }

        return isValidTime(data);
      },
      {
        message: 'You must provide a valid due date time',
      }
    )
    .nullable()
    .optional(),
  dueDateTimeZone: TimezoneSchema.nullable().optional(),
  listId: z.string(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

// Types
export type Task = z.infer<typeof TaskSchema>;

export type CreateTask = z.infer<typeof CreateTaskSchema>;

export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
