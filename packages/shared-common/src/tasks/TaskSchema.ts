import { z } from 'zod';

import { getTimezones, isValidTime } from '../Helpers';

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
  dueDate: z
    .string()
    .refine(
      (data) => {
        if (!data) {
          return true;
        }

        const now = new Date();
        const dueDate = new Date(data);

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
  dueDateTimeZone: z
    .string()
    .refine(
      (data) => {
        if (!data) {
          return true;
        }

        const timezones = getTimezones();

        return timezones.includes(data);
      },
      {
        message: 'You must provide a valid timezone',
      }
    )
    .nullable()
    .optional(),
  listId: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema;

// Types
export type Task = z.infer<typeof TaskSchema>;

export type CreateTask = z.infer<typeof CreateTaskSchema>;

export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
