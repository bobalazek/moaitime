import { z } from 'zod';

import { ColorSchema } from '../core/ColorSchema';
import { TimezoneSchema } from '../core/TimezoneSchema';
import { isValidDate, isValidTime } from '../Helpers';
import { TagSchema } from '../tasks/TagSchema';
import { ListSchema } from './ListSchema';

export const TaskBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  color: z.string().nullable(),
  description: z.string().nullable(),
  priority: z.number().nullable(),
  dueDate: z.string().nullable(),
  dueDateTime: z.string().nullable(),
  dueDateTimeZone: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  completedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  listId: z.string().nullable(),
  parentId: z.string().nullable(),
  tags: z.array(TagSchema).optional(),
  tagIds: z.array(z.string()).optional(),
  list: ListSchema.optional(),
});

export const TaskSchema = TaskBaseSchema.extend({
  children: z.array(TaskBaseSchema).optional(),
});

export const CreateTaskSchema = z.object({
  name: z.string().min(1, {
    message: 'Task name must be provided',
  }),
  color: ColorSchema.nullable().optional(),
  priority: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  dueDate: z
    .string()
    .refine(
      (data) => {
        if (!data) {
          return true;
        }

        return isValidDate(data);
      },
      {
        message: 'Due date must be valid',
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
  durationSeconds: z.number().nullable().optional(),
  listId: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

// Types
export type Task = z.infer<typeof TaskSchema>;

export type CreateTask = z.infer<typeof CreateTaskSchema>;

export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
